import { ERROR_MESSAGES } from './constants';

// Error types
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  isOperational?: boolean;
}

// Custom error classes
export class ValidationError extends Error implements AppError {
  public code: string;
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, field?: string) {
    super(field ? `${field}: ${message}` : message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
    this.statusCode = 400;
    this.isOperational = true;
  }
}

export class DatabaseError extends Error implements AppError {
  public code: string;
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
    this.code = 'DATABASE_ERROR';
    this.statusCode = 500;
    this.isOperational = true;
    
    if (originalError) {
      this.cause = originalError;
    }
  }
}

export class NotFoundError extends Error implements AppError {
  public code: string;
  public statusCode: number;
  public isOperational: boolean;

  constructor(resource: string) {
    super(`${resource} tidak ditemukan`);
    this.name = 'NotFoundError';
    this.code = 'NOT_FOUND';
    this.statusCode = 404;
    this.isOperational = true;
  }
}

export class UnauthorizedError extends Error implements AppError {
  public code: string;
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message);
    this.name = 'UnauthorizedError';
    this.code = 'UNAUTHORIZED';
    this.statusCode = 401;
    this.isOperational = true;
  }
}

// Error handler utility
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle and log errors
  public handleError(error: AppError | Error, context?: string): void {
    const appError = this.normalizeError(error);
    
    // Log error
    this.logError(appError, context);
    
    // In production, you might want to send to external service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(appError, context);
    }
  }

  // Normalize error to AppError format
  private normalizeError(error: AppError | Error): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      isOperational: false,
    };
  }

  // Check if error is AppError
  private isAppError(error: any): error is AppError {
    return error && typeof error === 'object' && 'code' in error;
  }

  // Log error to console and internal log
  private logError(error: AppError, context?: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack,
      },
      context,
    };

    // Add to internal log
    this.errorLog.push(error);

    // Console log
    console.error('Error occurred:', logEntry);

    // Keep only last 100 errors in memory
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }
  }

  // Send error to external service (e.g., Sentry, LogRocket)
  private sendToExternalService(error: AppError, context?: string): void {
    // Implement your external error reporting service here
    // Example: Sentry.captureException(error);
    console.log('Sending error to external service:', { error, context });
  }

  // Get error statistics
  public getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byCode: {} as Record<string, number>,
      byStatus: {} as Record<number, number>,
      recent: this.errorLog.slice(-10),
    };

    this.errorLog.forEach(error => {
      // Count by error code
      stats.byCode[error.code || 'UNKNOWN'] = (stats.byCode[error.code || 'UNKNOWN'] || 0) + 1;
      
      // Count by status code
      stats.byStatus[error.statusCode || 500] = (stats.byStatus[error.statusCode || 500] || 0) + 1;
    });

    return stats;
  }

  // Clear error log
  public clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Utility functions for common error scenarios
export const createValidationError = (message: string, field?: string): ValidationError => {
  return new ValidationError(message, field);
};

export const createDatabaseError = (message: string, originalError?: any): DatabaseError => {
  return new DatabaseError(message, originalError);
};

export const createNotFoundError = (resource: string): NotFoundError => {
  return new NotFoundError(resource);
};

export const createUnauthorizedError = (message?: string): UnauthorizedError => {
  return new UnauthorizedError(message);
};

// Async error wrapper
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorHandler = ErrorHandler.getInstance();
      errorHandler.handleError(error as Error, context);
      throw error;
    }
  };
};

// Error boundary helper
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return ERROR_MESSAGES.SERVER_ERROR;
};

// Error response formatter
export const formatErrorResponse = (error: AppError | Error) => {
  const appError = ErrorHandler.getInstance().normalizeError(error);
  
  return {
    success: false,
    error: {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
    },
    timestamp: new Date().toISOString(),
  };
}; 