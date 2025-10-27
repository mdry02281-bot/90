# 🔍 Code Review Checklist - PromoHive

## 📋 **Data Fetching & API Usage**

### ✅ **Required Checks:**
- [ ] **No localStorage/sessionStorage usage** - All data must come from API
- [ ] **Uses unified `useApi` hook** - No direct fetch/axios calls
- [ ] **Proper error handling** - Network errors are handled gracefully
- [ ] **Loading states** - UI shows loading indicators during API calls
- [ ] **Retry logic** - Failed requests are retried automatically
- [ ] **No hardcoded data** - All data comes from database via API

### ❌ **Forbidden Patterns:**
- [ ] `localStorage.getItem()` or `localStorage.setItem()`
- [ ] `sessionStorage.getItem()` or `sessionStorage.setItem()`
- [ ] Direct `fetch()` calls outside of `useApi` hook
- [ ] Direct `axios` calls outside of `useApi` hook
- [ ] Hardcoded mock data in components
- [ ] `tRPC` usage (use unified API system instead)

## 🔐 **Authentication & Authorization**

### ✅ **Required Checks:**
- [ ] **Uses unified `useAuth` hook** - No custom auth logic
- [ ] **Proper token handling** - Cookies are used for authentication
- [ ] **Role-based access** - Admin routes are properly protected
- [ ] **Session management** - Logout clears all user data
- [ ] **Error handling** - Auth errors redirect to login

### ❌ **Forbidden Patterns:**
- [ ] Custom auth hooks or context
- [ ] Manual token storage in localStorage
- [ ] Direct JWT manipulation
- [ ] Bypassing auth middleware

## 🎨 **Component Structure**

### ✅ **Required Checks:**
- [ ] **Proper TypeScript types** - All props and state are typed
- [ ] **Error boundaries** - Components handle errors gracefully
- [ ] **Loading states** - Users see feedback during operations
- [ ] **Accessibility** - Components are accessible
- [ ] **Responsive design** - Works on all screen sizes

### ❌ **Forbidden Patterns:**
- [ ] `any` types without justification
- [ ] Missing error handling
- [ ] No loading states for async operations
- [ ] Hardcoded styles instead of Tailwind classes

## 🗄️ **Database & API Integration**

### ✅ **Required Checks:**
- [ ] **Proper Prisma usage** - Database queries are optimized
- [ ] **Error handling** - Database errors are caught and logged
- [ ] **Data validation** - Input data is validated with Zod
- [ ] **Logging** - All operations are logged with context
- [ ] **Performance** - Queries are efficient and paginated

### ❌ **Forbidden Patterns:**
- [ ] Raw SQL queries without Prisma
- [ ] Missing input validation
- [ ] Unhandled database errors
- [ ] Missing logging for operations

## 🔧 **Performance & Monitoring**

### ✅ **Required Checks:**
- [ ] **APM integration** - Performance is monitored
- [ ] **Memory usage** - No memory leaks
- [ ] **Bundle size** - No unnecessary dependencies
- [ ] **Caching strategy** - Appropriate caching is implemented
- [ ] **Error tracking** - Errors are properly logged

### ❌ **Forbidden Patterns:**
- [ ] Memory leaks in useEffect
- [ ] Large bundle sizes
- [ ] Missing error tracking
- [ ] No performance monitoring

## 🧪 **Testing**

### ✅ **Required Checks:**
- [ ] **Unit tests** - Core logic is tested
- [ ] **Integration tests** - API endpoints are tested
- [ ] **E2E tests** - Critical user flows are tested
- [ ] **Test coverage** - Minimum 80% coverage
- [ ] **Mock data** - Tests use proper mocks

### ❌ **Forbidden Patterns:**
- [ ] Tests that use localStorage
- [ ] Tests without proper mocking
- [ ] Missing error case tests
- [ ] Tests that depend on external services

## 📝 **Documentation**

### ✅ **Required Checks:**
- [ ] **Code comments** - Complex logic is documented
- [ ] **API documentation** - Endpoints are documented
- [ ] **README updates** - New features are documented
- [ ] **Type definitions** - All types are well-defined
- [ ] **Error messages** - User-friendly error messages

### ❌ **Forbidden Patterns:**
- [ ] Uncommented complex logic
- [ ] Missing API documentation
- [ ] Outdated README
- [ ] Generic error messages

## 🚀 **Deployment & Environment**

### ✅ **Required Checks:**
- [ ] **Environment variables** - All config is in env files
- [ ] **Security** - No secrets in code
- [ ] **CORS settings** - Proper CORS configuration
- [ ] **Rate limiting** - API endpoints are rate limited
- [ ] **Health checks** - Monitoring endpoints work

### ❌ **Forbidden Patterns:**
- [ ] Hardcoded secrets
- [ ] Missing environment variables
- [ ] Improper CORS settings
- [ ] No rate limiting

## 🔍 **Review Process**

### **Before Review:**
1. Run `npm run test` - All tests must pass
2. Run `npm run lint` - No linting errors
3. Run `npm run build` - Build must succeed
4. Check test coverage - Minimum 80%

### **During Review:**
1. **Check data flow** - Verify all data comes from API
2. **Check authentication** - Verify proper auth handling
3. **Check error handling** - Verify graceful error handling
4. **Check performance** - Verify no performance issues
5. **Check security** - Verify no security vulnerabilities

### **After Review:**
1. **Merge only if all checks pass**
2. **Update documentation if needed**
3. **Run integration tests**
4. **Monitor performance metrics**

## 🚨 **Critical Issues (Blocking)**

These issues **MUST** be fixed before merge:

- [ ] Any localStorage/sessionStorage usage
- [ ] Direct fetch/axios calls outside useApi
- [ ] Custom auth logic outside useAuth
- [ ] Missing error handling
- [ ] Security vulnerabilities
- [ ] Performance regressions
- [ ] Failing tests

## 📊 **Review Metrics**

Track these metrics for each review:

- **Data Source Compliance**: 100% API usage
- **Test Coverage**: Minimum 80%
- **Performance**: No regressions
- **Security**: No vulnerabilities
- **Accessibility**: WCAG compliance

---

**Remember**: The goal is to ensure all data comes from the database via API, with proper error handling, performance monitoring, and security measures in place.
