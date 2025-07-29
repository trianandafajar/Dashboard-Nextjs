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

    return withRetry(async () => {
      try {
        const data = await sql<Revenue>`SELECT * FROM revenue`;
        setCachedData(cacheKey, data.rows);
        return data.rows;
      } catch (error) {
        handleDatabaseError(error, 'fetchRevenue');
      }
    });
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

    return withRetry(async () => {
      try {
        const data = await sql<LatestInvoiceRaw>`
          SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
          FROM invoices
          JOIN customers ON invoices.customer_id = customers.id
          ORDER BY invoices.date DESC
          LIMIT 5`;

        const latestInvoices = data.rows.map((invoice) => ({
          ...invoice,
          amount: formatCurrency(invoice.amount),
        }));
        
        setCachedData(cacheKey, latestInvoices);
        return latestInvoices;
      } catch (error) {
        handleDatabaseError(error, 'fetchLatestInvoices');
      }
    });
  },

  async fetchCardData() {
    const cacheKey = CACHE_KEYS.CARD_DATA;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    return withRetry(async () => {
      try {
        const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
        const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
        const invoiceStatusPromise = sql`SELECT
             SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
             SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
             FROM invoices`;

        const data = await Promise.all([
          invoiceCountPromise,
          customerCountPromise,
          invoiceStatusPromise,
        ]);

        const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
        const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
        const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
        const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");

        const result = {
          numberOfCustomers,
          numberOfInvoices,
          totalPaidInvoices,
          totalPendingInvoices,
        };
        
        setCachedData(cacheKey, result);
        return result;
      } catch (error) {
        handleDatabaseError(error, 'fetchCardData');
      }
    });
  },

  async fetchFilteredInvoices(query: string, currentPage: number) {
    const offset = (currentPage - 1) * 6;

    return withRetry(async () => {
      try {
        const invoices = await sql<InvoicesTable>`
          SELECT
            invoices.id,
            invoices.amount,
            invoices.date,
            invoices.status,
            customers.name,
            customers.email,
            customers.image_url
          FROM invoices
          JOIN customers ON invoices.customer_id = customers.id
          WHERE
            customers.name ILIKE ${`%${query}%`} OR
            customers.email ILIKE ${`%${query}%`} OR
            invoices.amount::text ILIKE ${`%${query}%`} OR
            invoices.date::text ILIKE ${`%${query}%`}
          ORDER BY invoices.date DESC
          LIMIT 6 OFFSET ${offset}`;

        return invoices.rows;
      } catch (error) {
        handleDatabaseError(error, 'fetchFilteredInvoices');
      }
    });
  },

  async fetchInvoicesPages(query: string) {
    return withRetry(async () => {
      try {
        const count = await sql`SELECT COUNT(*)
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        WHERE
          customers.name ILIKE ${`%${query}%`} OR
          customers.email ILIKE ${`%${query}%`} OR
          invoices.amount::text ILIKE ${`%${query}%`} OR
          invoices.date::text ILIKE ${`%${query}%`}`;

        const totalPages = Math.ceil(Number(count.rows[0].count) / 6);
        return totalPages;
      } catch (error) {
        handleDatabaseError(error, 'fetchInvoicesPages');
      }
    });
  },

  async fetchInvoiceById(id: string) {
    return withRetry(async () => {
      try {
        const data = await sql<InvoiceForm>`
          SELECT
            invoices.id,
            invoices.customer_id,
            invoices.amount,
            invoices.status
          FROM invoices
          WHERE invoices.id = ${id}`;

        const invoice = data.rows.map((invoice) => ({
          ...invoice,
          amount: invoice.amount / 100,
        }));

        return invoice[0];
      } catch (error) {
        handleDatabaseError(error, 'fetchInvoiceById');
      }
    });
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

    return withRetry(async () => {
      try {
        const data = await sql<CustomerField>`
          SELECT
            id,
            name
          FROM customers
          ORDER BY name ASC
        `;
        
        setCachedData(cacheKey, data.rows);
        return data.rows;
      } catch (error) {
        handleDatabaseError(error, 'fetchCustomers');
      }
    });
  },

  async fetchFilteredCustomers(query: string) {
    return withRetry(async () => {
      try {
        const data = await sql<CustomersTableType>`
          SELECT
            customers.id,
            customers.name,
            customers.email,
            customers.image_url,
            COUNT(invoices.id) AS total_invoices,
            SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
            SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
          FROM customers
          LEFT JOIN invoices ON customers.id = invoices.customer_id
          WHERE
            customers.name ILIKE ${`%${query}%`} OR
            customers.email ILIKE ${`%${query}%`}
          GROUP BY customers.id, customers.name, customers.email, customers.image_url
          ORDER BY customers.name ASC
        `;

        const customers = data.rows.map((customer) => ({
          ...customer,
          total_pending: formatCurrency(customer.total_pending || 0),
          total_paid: formatCurrency(customer.total_paid || 0),
        }));

        return customers;
      } catch (error) {
        handleDatabaseError(error, 'fetchFilteredCustomers');
      }
    });
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