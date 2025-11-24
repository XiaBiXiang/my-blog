# Error Handling System

This document describes the comprehensive error handling system implemented for the portfolio site.

## Overview

The error handling system provides:

- Centralized error classification and user-friendly messages
- Global error boundary for React errors
- Network status monitoring
- Realtime connection error handling with auto-retry
- Auth error handling with session management
- Database error handling with retry logic
- Toast notifications for temporary messages

## Components

### 1. Error Classification (`src/lib/utils/errors.ts`)

The `classifyError()` function categorizes errors into types:

- `AUTH`: Authentication errors (invalid credentials, session expired, etc.)
- `DATABASE`: Database connection and query errors
- `NETWORK`: Network connectivity issues
- `REALTIME`: WebSocket/Realtime connection errors
- `PERMISSION`: Authorization/permission errors
- `VALIDATION`: Input validation errors
- `UNKNOWN`: Unclassified errors

Each error includes:

- `type`: Error category
- `message`: User-friendly Chinese message
- `originalError`: Original error object for debugging
- `retryable`: Whether the operation can be retried

### 2. Error Boundary (`src/components/ui/ErrorBoundary.tsx`)

Global React error boundary that catches component errors and displays a friendly UI.

Features:

- Catches all React component errors
- Shows user-friendly error message
- Provides retry and "go home" buttons
- Shows error details in development mode
- Can be customized with fallback UI

Usage:

```tsx
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

### 3. Error Message Component (`src/components/ui/ErrorMessage.tsx`)

Reusable component for displaying error messages with appropriate icons and styling.

Features:

- Type-specific icons (network, auth, permission, etc.)
- Optional retry button for retryable errors
- Consistent styling across the app

Usage:

```tsx
<ErrorMessage error={appError} onRetry={() => retryOperation()} />
```

### 4. Toast Notifications (`src/components/ui/Toast.tsx`)

Temporary notification system for success/error/warning/info messages.

Features:

- Auto-dismiss after configurable duration
- Slide-in animation
- Type-specific colors and icons
- Manual close button

Usage:

```tsx
const { success, error, warning, info } = useToastContext()

success('操作成功！')
error('操作失败，请重试')
```

### 5. Network Status Monitor (`src/components/ui/NetworkStatus.tsx`)

Displays a banner when the user goes offline and shows a success message when reconnected.

Features:

- Automatic detection of online/offline status
- Shows reconnection message briefly
- Non-intrusive banner at top of screen

### 6. Enhanced Hooks

#### useAuth Hook

Enhanced with:

- Error classification for auth operations
- Retry logic for session initialization
- Session expiration handling
- User-friendly error messages

#### useRealtime Hook

Enhanced with:

- Connection status tracking
- Automatic retry with exponential backoff
- Error callbacks
- Connection state management

#### useNetworkStatus Hook

New hook for monitoring network connectivity:

```tsx
const { isOnline, wasOffline } = useNetworkStatus()
```

## Error Handling Patterns

### 1. Authentication Errors

```tsx
try {
  await signIn(email, password)
} catch (err) {
  const appError = classifyError(err)
  // appError.message will be user-friendly Chinese message
  setError(appError.message)
}
```

### 2. Database Operations

```tsx
const loadData = async () => {
  try {
    setError(null)
    const { data, error } = await supabase.from('table').select()
    if (error) throw error
    setData(data)
  } catch (err) {
    const appError = classifyError(err)
    logError(appError, 'Load data')
    setError(appError.message)
  }
}
```

### 3. Retry with Backoff

```tsx
import { retryWithBackoff } from '@/lib/utils/errors'

const data = await retryWithBackoff(
  () => fetchData(),
  3, // max retries
  1000 // initial delay in ms
)
```

### 4. Network-Aware Operations

```tsx
import { isOnline, waitForOnline } from '@/lib/utils/errors'

if (!isOnline()) {
  await waitForOnline()
}
// Proceed with network operation
```

## User-Friendly Error Messages

All error messages are in Chinese and user-friendly:

| Error Type          | Example Message                  |
| ------------------- | -------------------------------- |
| Invalid credentials | 邮箱或密码不正确                 |
| Email not confirmed | 请先验证您的邮箱地址             |
| Session expired     | 会话已过期，请重新登录           |
| Permission denied   | 您没有权限执行此操作             |
| Network error       | 网络连接失败，请检查您的网络连接 |
| Database error      | 数据库操作失败，请稍后重试       |

## Realtime Connection Handling

The enhanced `useRealtime` hook automatically handles:

- Connection failures with retry
- Exponential backoff (up to 5 retries)
- Connection timeout handling
- Status tracking (connecting/connected/disconnected/error)

```tsx
const { status, retryCount } = useRealtime({
  table: 'guestbook',
  onInsert: (record) => handleNewRecord(record),
  onError: (error) => console.error('Realtime error:', error),
})
```

## Testing Error Handling

To test error scenarios:

1. **Network errors**: Use browser DevTools to go offline
2. **Auth errors**: Try invalid credentials
3. **Permission errors**: Try accessing admin routes as regular user
4. **Database errors**: Temporarily break Supabase connection
5. **Realtime errors**: Disconnect WebSocket in DevTools

## Best Practices

1. **Always classify errors**: Use `classifyError()` for consistent error handling
2. **Log errors**: Use `logError()` to log errors with context
3. **Provide retry**: For retryable errors, always provide a retry button
4. **User-friendly messages**: Never show raw error messages to users
5. **Handle edge cases**: Consider offline, timeout, and permission scenarios
6. **Test error paths**: Test all error scenarios during development

## Future Enhancements

Potential improvements:

- Integration with error tracking service (Sentry, LogRocket)
- Error analytics and monitoring
- Offline queue for failed operations
- More granular retry strategies
- Error recovery suggestions
