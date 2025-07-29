// Re-export services from database.ts for backward compatibility
export {
  revenueService,
  invoiceService,
  customerService,
  cacheService,
} from './database';

// Legacy functions for backward compatibility
import { 
  CustomerField, 
  CustomersTableType, 
  InvoiceForm, 
  InvoicesTable, 
  LatestInvoiceRaw, 
  Revenue 
} from "./definitions";
import { formatCurrency } from "./utils";
import { ERROR_MESSAGES } from "./constants";

// Legacy function wrappers
export async function fetchRevenue(): Promise<Revenue[]> {
  const { revenueService } = await import('./database');
  return revenueService.fetchRevenue();
}

export async function fetchLatestInvoices() {
  const { invoiceService } = await import('./database');
  return invoiceService.fetchLatestInvoices();
}

export async function fetchCardData() {
  const { invoiceService } = await import('./database');
  return invoiceService.fetchCardData();
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const { invoiceService } = await import('./database');
  return invoiceService.fetchFilteredInvoices(query, currentPage);
}

export async function fetchInvoicesPages(query: string) {
  const { invoiceService } = await import('./database');
  return invoiceService.fetchInvoicesPages(query);
}

export async function fetchInvoiceById(id: string) {
  const { invoiceService } = await import('./database');
  return invoiceService.fetchInvoiceById(id);
}

export async function fetchCustomers() {
  const { customerService } = await import('./database');
  return customerService.fetchCustomers();
}

export async function fetchFilteredCustomers(query: string) {
  const { customerService } = await import('./database');
  return customerService.fetchFilteredCustomers(query);
}

// Legacy create, update, delete functions
export async function createInvoice(formData: FormData) {
  const { invoiceService } = await import('./database');
  return invoiceService.createInvoice(formData);
}

export async function updateInvoice(id: string, formData: FormData) {
  const { invoiceService } = await import('./database');
  return invoiceService.updateInvoice(id, formData);
}

export async function deleteInvoice(id: string) {
  const { invoiceService } = await import('./database');
  return invoiceService.deleteInvoice(id);
}
