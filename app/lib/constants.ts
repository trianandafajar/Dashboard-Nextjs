// App Configuration
export const APP_CONFIG = {
  name: 'Acme Dashboard',
  description: 'Modern dashboard built with Next.js and TypeScript',
  version: '1.0.0',
  author: 'Acme Team',
  url: 'https://acme-dashboard.com',
} as const;

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 6,
  MAX_PAGES_SHOWN: 7,
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 300, // 5 minutes
} as const;

// Status Types
export const STATUS_TYPES = {
  PENDING: 'pending',
  PAID: 'paid',
} as const;

// Currency Configuration
export const CURRENCY_CONFIG = {
  DEFAULT_LOCALE: 'id-ID',
  DEFAULT_CURRENCY: 'IDR',
  FALLBACK_LOCALE: 'en-US',
  FALLBACK_CURRENCY: 'USD',
} as const;

// Date Configuration
export const DATE_CONFIG = {
  DEFAULT_LOCALE: 'id-ID',
  FALLBACK_LOCALE: 'en-US',
  DEFAULT_TIMEZONE: 'Asia/Jakarta',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  DATABASE_ERROR: 'Terjadi kesalahan pada database',
  FETCH_ERROR: 'Gagal mengambil data',
  VALIDATION_ERROR: 'Data tidak valid',
  UNAUTHORIZED: 'Anda tidak memiliki akses',
  NOT_FOUND: 'Data tidak ditemukan',
  SERVER_ERROR: 'Terjadi kesalahan pada server',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  DATA_CREATED: 'Data berhasil dibuat',
  DATA_UPDATED: 'Data berhasil diperbarui',
  DATA_DELETED: 'Data berhasil dihapus',
  LOGIN_SUCCESS: 'Login berhasil',
  LOGOUT_SUCCESS: 'Logout berhasil',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Format email tidak valid',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
    MESSAGE: 'Password harus minimal 8 karakter dengan huruf besar, kecil, dan angka',
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    MESSAGE: 'Nama harus 2-50 karakter',
  },
} as const;

// Cache Keys
export const CACHE_KEYS = {
  REVENUE: 'revenue',
  INVOICES: 'invoices',
  CUSTOMERS: 'customers',
  CARD_DATA: 'card-data',
  USER_PROFILE: 'user-profile',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  INVOICES: '/dashboard/invoices',
  CUSTOMERS: '/dashboard/customers',
  PROFILE: '/dashboard/profile',
} as const; 