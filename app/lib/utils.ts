import { Revenue } from './definitions';
import { CURRENCY_CONFIG, DATE_CONFIG, PAGINATION, ERROR_MESSAGES } from './constants';

// Currency formatting with better error handling and localization
export const formatCurrency = (
  amount: number, 
  locale: string = CURRENCY_CONFIG.DEFAULT_LOCALE,
  currency: string = CURRENCY_CONFIG.DEFAULT_CURRENCY
) => {
  try {
    // Convert from cents to main currency unit
    const value = amount / 100;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    console.error('Currency formatting error:', error);
    // Fallback formatting
    return new Intl.NumberFormat(CURRENCY_CONFIG.FALLBACK_LOCALE, {
      style: 'currency',
      currency: CURRENCY_CONFIG.FALLBACK_CURRENCY,
    }).format(amount / 100);
  }
};

// Date formatting with timezone support
export const formatDateToLocal = (
  dateStr: string,
  locale: string = DATE_CONFIG.DEFAULT_LOCALE,
  options?: Intl.DateTimeFormatOptions
) => {
  try {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: DATE_CONFIG.DEFAULT_TIMEZONE,
    };

    const formatter = new Intl.DateTimeFormat(locale, {
      ...defaultOptions,
      ...options,
    });
    
    return formatter.format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    // Fallback formatting
    return new Intl.DateTimeFormat(DATE_CONFIG.FALLBACK_LOCALE, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  }
};

// Enhanced Y-axis generation with better scaling
export const generateYAxis = (revenue: Revenue[]) => {
  try {
    if (!revenue || revenue.length === 0) {
      return { yAxisLabels: [], topLabel: 0 };
    }

    const yAxisLabels: string[] = [];
    const highestRecord = Math.max(...revenue.map((month) => month.revenue));
    
    if (highestRecord === 0) {
      return { yAxisLabels: ['$0'], topLabel: 0 };
    }

    // Dynamic scaling based on the highest value
    const scale = Math.pow(10, Math.floor(Math.log10(highestRecord)));
    const topLabel = Math.ceil(highestRecord / scale) * scale;
    const step = topLabel / 5; // 5 steps for better readability

    for (let i = topLabel; i >= 0; i -= step) {
      const value = i / 1000;
      yAxisLabels.push(value >= 1 ? `$${value}K` : `$${i}`);
    }

    return { yAxisLabels, topLabel };
  } catch (error) {
    console.error('Y-axis generation error:', error);
    return { yAxisLabels: ['$0'], topLabel: 0 };
  }
};

// Enhanced pagination with better edge case handling
export const generatePagination = (currentPage: number, totalPages: number) => {
  try {
    if (totalPages <= 0 || currentPage <= 0) {
      return [];
    }

    if (totalPages <= PAGINATION.MAX_PAGES_SHOWN) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first and last page
    const pages: (number | string)[] = [1];

    if (currentPage <= 3) {
      // Show first 3 pages, ellipsis, last 2 pages
      pages.push(2, 3, '...', totalPages - 1, totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Show first 2 pages, ellipsis, last 3 pages
      pages.push(2, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
      pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    return pages;
  } catch (error) {
    console.error('Pagination generation error:', error);
    return [];
  }
};

// Utility function to debounce function calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Utility function to throttle function calls
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Utility function to validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to validate password strength
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password minimal 8 karakter');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password harus mengandung huruf kecil');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password harus mengandung huruf besar');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password harus mengandung angka');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utility function to generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Utility function to deep clone objects
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
};
