import { sql } from "@vercel/postgres";
import { 
  CustomerField, 
  CustomersTableType, 
  InvoiceForm, 
  InvoicesTable, 
  LatestInvoiceRaw, 
  Revenue 
} from "./definitions";
import { formatCurrency } from "./utils";
import { ERROR_MESSAGES, API_CONFIG, CACHE_KEYS } from "./constants";
import { customers, invoices, revenue } from "./placeholder-data";

// Simple in-memory cache (in production, use Redis or similar)
const cache = new Map<string, { data: any; timestamp: number }>();

// Cache helper functions
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < API_CONFIG.CACHE_DURATION * 1000) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Database error handler
const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Database Error in ${operation}:`, error);
  
  if (error.code === '23505') { // Unique constraint violation
    throw new Error('Data sudah ada dalam sistem');
  }
  
  if (error.code === '23503') { // Foreign key violation
    throw new Error('Data terkait tidak ditemukan');
  }
  
  throw new Error(`${ERROR_MESSAGES.DATABASE_ERROR}: ${operation}`);
};

// Retry mechanism for database operations
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError!;
};

// Revenue data service
export const revenueService = {
  async fetchRevenue(): Promise<Revenue[]> {
    const cacheKey = CACHE_KEYS.REVENUE;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Use placeholder data for now
    setCachedData(cacheKey, revenue);
    return revenue;
  }
};

// Invoice data service
export const invoiceService = {
  async fetchLatestInvoices() {
    const cacheKey = `${CACHE_KEYS.INVOICES}_latest`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Use placeholder data for now
    const latestInvoices = invoices.slice(0, 5).map((invoice, index) => {
      const customer = customers.find(c => c.id === invoice.customer_id);
      return {
        id: `invoice-${index}`,
        amount: formatCurrency(invoice.amount),
        name: customer?.name || 'Unknown Customer',
        email: customer?.email || 'unknown@example.com',
        image_url: customer?.image_url || '/customers/default.png',
      };
    });
    
    setCachedData(cacheKey, latestInvoices);
    return latestInvoices;
  },

  async fetchCardData() {
    const cacheKey = CACHE_KEYS.CARD_DATA;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Use placeholder data for now
    const numberOfInvoices = invoices.length;
    const numberOfCustomers = customers.length;
    const totalPaidInvoices = formatCurrency(
      invoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.amount, 0)
    );
    const totalPendingInvoices = formatCurrency(
      invoices
        .filter(invoice => invoice.status === 'pending')
        .reduce((sum, invoice) => sum + invoice.amount, 0)
    );

    const result = {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
    
    setCachedData(cacheKey, result);
    return result;
  },

  async fetchFilteredInvoices(query: string, currentPage: number) {
    const offset = (currentPage - 1) * 6;

    // Use placeholder data for now
    const filteredInvoices = invoices
      .map((invoice, index) => {
        const customer = customers.find(c => c.id === invoice.customer_id);
        return {
          id: `invoice-${index}`,
          amount: invoice.amount,
          date: invoice.date,
          status: invoice.status,
          name: customer?.name || 'Unknown Customer',
          email: customer?.email || 'unknown@example.com',
          image_url: customer?.image_url || '/customers/default.png',
        };
      })
      .filter(invoice => 
        invoice.name.toLowerCase().includes(query.toLowerCase()) ||
        invoice.email.toLowerCase().includes(query.toLowerCase()) ||
        invoice.amount.toString().includes(query) ||
        invoice.date.includes(query)
      )
      .slice(offset, offset + 6);

    return filteredInvoices;
  },

  async fetchInvoicesPages(query: string) {
    // Use placeholder data for now
    const filteredInvoices = invoices
      .map((invoice, index) => {
        const customer = customers.find(c => c.id === invoice.customer_id);
        return {
          id: `invoice-${index}`,
          amount: invoice.amount,
          date: invoice.date,
          status: invoice.status,
          name: customer?.name || 'Unknown Customer',
          email: customer?.email || 'unknown@example.com',
          image_url: customer?.image_url || '/customers/default.png',
        };
      })
      .filter(invoice => 
        invoice.name.toLowerCase().includes(query.toLowerCase()) ||
        invoice.email.toLowerCase().includes(query.toLowerCase()) ||
        invoice.amount.toString().includes(query) ||
        invoice.date.includes(query)
      );

    const totalPages = Math.ceil(filteredInvoices.length / 6);
    return totalPages;
  },

  async fetchInvoiceById(id: string) {
    // Use placeholder data for now
    const invoiceIndex = parseInt(id.replace('invoice-', ''));
    const invoice = invoices[invoiceIndex];
    
    if (!invoice) {
      return null;
    }

    return {
      id: `invoice-${invoiceIndex}`,
      customer_id: invoice.customer_id,
      amount: invoice.amount / 100,
      status: invoice.status,
    };
  },

  async createInvoice(formData: FormData) {
    return withRetry(async () => {
      try {
        const { customerId, amount, status } = Object.fromEntries(formData);
        
        const amountInCents = Math.round(Number(amount) * 100);
        
        await sql`
          INSERT INTO invoices (customer_id, amount, status)
          VALUES (${customerId as string}, ${amountInCents}, ${status as string})
        `;
        
        // Clear related cache
        cache.delete(CACHE_KEYS.INVOICES);
        cache.delete(CACHE_KEYS.CARD_DATA);
      } catch (error) {
        handleDatabaseError(error, 'createInvoice');
      }
    });
  },

  async updateInvoice(id: string, formData: FormData) {
    return withRetry(async () => {
      try {
        const { customerId, amount, status } = Object.fromEntries(formData);
        
        const amountInCents = Math.round(Number(amount) * 100);
        
        await sql`
          UPDATE invoices
          SET customer_id = ${customerId as string}, amount = ${amountInCents}, status = ${status as string}
          WHERE id = ${id}
        `;
        
        // Clear related cache
        cache.delete(CACHE_KEYS.INVOICES);
        cache.delete(CACHE_KEYS.CARD_DATA);
      } catch (error) {
        handleDatabaseError(error, 'updateInvoice');
      }
    });
  },

  async deleteInvoice(id: string) {
    return withRetry(async () => {
      try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        
        // Clear related cache
        cache.delete(CACHE_KEYS.INVOICES);
        cache.delete(CACHE_KEYS.CARD_DATA);
      } catch (error) {
        handleDatabaseError(error, 'deleteInvoice');
      }
    });
  }
};

// Customer data service
export const customerService = {
  async fetchCustomers() {
    const cacheKey = CACHE_KEYS.CUSTOMERS;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Use placeholder data for now
    setCachedData(cacheKey, customers);
    return customers;
  },

  async fetchFilteredCustomers(query: string) {
    // Use placeholder data for now
    const filteredCustomers = customers
      .filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
      )
      .map(customer => {
        const customerInvoices = invoices.filter(invoice => invoice.customer_id === customer.id);
        const total_pending = customerInvoices
          .filter(invoice => invoice.status === 'pending')
          .reduce((sum, invoice) => sum + invoice.amount, 0);
        const total_paid = customerInvoices
          .filter(invoice => invoice.status === 'paid')
          .reduce((sum, invoice) => sum + invoice.amount, 0);

        return {
          ...customer,
          total_invoices: customerInvoices.length,
          total_pending: formatCurrency(total_pending),
          total_paid: formatCurrency(total_paid),
        };
      });

    return filteredCustomers;
  }
};

// Cache management
export const cacheService = {
  clearCache() {
    cache.clear();
  },
  
  clearCacheByKey(key: string) {
    cache.delete(key);
  },
  
  getCacheStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
    };
  }
}; 