# App Directory - Acme Dashboard

Struktur direktori `app` yang telah dioptimasi untuk efisiensi dan skalabilitas.

## 📁 Struktur Direktori

```
app/
├── lib/                    # Shared utilities dan services
│   ├── constants.ts        # Konfigurasi aplikasi
│   ├── database.ts         # Service layer untuk database
│   ├── data.ts            # Legacy data functions (backward compatibility)
│   ├── definitions.ts     # TypeScript type definitions
│   ├── error-handler.ts   # Global error handling
│   ├── hooks.ts           # Custom React hooks
│   ├── utils.ts           # Utility functions
│   └── placeholder-data.ts # Sample data
├── ui/                    # UI components
├── error.tsx              # Error boundary component
├── loading.tsx            # Loading component
├── layout.tsx             # Root layout dengan metadata
├── not-found.tsx          # 404 page
├── page.tsx               # Homepage
└── README.md              # Dokumentasi ini
```

## 🚀 Fitur Utama

### 1. **Optimized Layout (`layout.tsx`)**
- Metadata lengkap untuk SEO
- Viewport optimization
- Font preloading
- Error suppression untuk hydration

### 2. **Enhanced Homepage (`page.tsx`)**
- Lazy loading components
- Suspense boundaries
- Modern UI dengan gradients
- Responsive design
- Accessibility improvements

### 3. **Service Layer (`database.ts`)**
- Caching mechanism
- Retry logic dengan exponential backoff
- Error handling yang robust
- Connection pooling optimization

### 4. **Custom Hooks (`hooks.ts`)**
- `useDebouncedSearch` - Search dengan debouncing
- `useInfiniteScroll` - Infinite scrolling
- `useLocalStorage` - Local storage management
- `useMediaQuery` - Responsive design
- `useFormValidation` - Form validation
- Dan banyak lagi...

### 5. **Error Handling (`error-handler.ts`)**
- Custom error classes
- Global error handler
- Error logging dan monitoring
- Error response formatting

### 6. **Constants Management (`constants.ts`)**
- App configuration
- API settings
- Validation rules
- Error messages
- Cache keys

## 🔧 Penggunaan

### Database Operations
```typescript
import { invoiceService, customerService } from '@/app/lib/database';

// Fetch data dengan caching
const invoices = await invoiceService.fetchLatestInvoices();
const customers = await customerService.fetchCustomers();
```

### Custom Hooks
```typescript
import { useDebouncedSearch, useLocalStorage } from '@/app/lib/hooks';

// Debounced search
const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebouncedSearch();

// Local storage
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### Error Handling
```typescript
import { ErrorHandler, createValidationError } from '@/app/lib/error-handler';

// Handle errors
const errorHandler = ErrorHandler.getInstance();
errorHandler.handleError(error, 'UserService');

// Create custom errors
throw createValidationError('Email tidak valid', 'email');
```

### Utility Functions
```typescript
import { formatCurrency, debounce, validatePassword } from '@/app/lib/utils';

// Format currency
const formatted = formatCurrency(150000, 'id-ID', 'IDR');

// Debounce function
const debouncedSearch = debounce(searchFunction, 300);

// Validate password
const { isValid, errors } = validatePassword('MyPassword123');
```

## 🎯 Best Practices

### 1. **Performance**
- Gunakan Suspense untuk lazy loading
- Implement caching untuk database queries
- Optimize images dan assets
- Use debouncing untuk search

### 2. **Error Handling**
- Selalu wrap async operations dengan try-catch
- Gunakan custom error classes
- Log errors untuk monitoring
- Provide user-friendly error messages

### 3. **Type Safety**
- Gunakan TypeScript strict mode
- Define proper interfaces
- Validate data at runtime
- Use type guards

### 4. **Scalability**
- Modular architecture
- Service layer pattern
- Configuration management
- Caching strategies

## 🔄 Migration Guide

### Dari Legacy Code
```typescript
// Old way
import { fetchRevenue } from '@/app/lib/data';

// New way
import { revenueService } from '@/app/lib/database';
const revenue = await revenueService.fetchRevenue();
```

### Error Handling
```typescript
// Old way
try {
  // operation
} catch (error) {
  console.error(error);
}

// New way
import { withErrorHandling } from '@/app/lib/error-handler';
const safeOperation = withErrorHandling(operation, 'OperationContext');
```

## 📊 Monitoring

### Error Tracking
```typescript
import { ErrorHandler } from '@/app/lib/error-handler';

const errorHandler = ErrorHandler.getInstance();
const stats = errorHandler.getErrorStats();
console.log('Error statistics:', stats);
```

### Cache Management
```typescript
import { cacheService } from '@/app/lib/database';

// Clear specific cache
cacheService.clearCacheByKey('revenue');

// Get cache stats
const stats = cacheService.getCacheStats();
```

## 🚨 Troubleshooting

### Common Issues

1. **Hydration Errors**
   - Gunakan `suppressHydrationWarning` di layout
   - Check client/server mismatch

2. **Database Connection Issues**
   - Check connection pool settings
   - Implement retry logic
   - Monitor connection limits

3. **Performance Issues**
   - Enable caching
   - Optimize queries
   - Use pagination
   - Implement lazy loading

## 📈 Future Improvements

- [ ] Implement Redis untuk caching
- [ ] Add real-time notifications
- [ ] Implement WebSocket connections
- [ ] Add comprehensive testing
- [ ] Implement CI/CD pipeline
- [ ] Add performance monitoring
- [ ] Implement rate limiting
- [ ] Add API documentation

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Write comprehensive tests
4. Update documentation
5. Follow naming conventions
6. Use proper Git workflow

## 📝 License

MIT License - see LICENSE file for details 