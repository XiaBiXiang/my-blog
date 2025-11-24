/**
 * Error handling utilities for the portfolio site
 * Provides centralized error classification and user-friendly messages
 */

export enum ErrorType {
  AUTH = 'auth',
  DATABASE = 'database',
  NETWORK = 'network',
  REALTIME = 'realtime',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown',
}

export interface AppError {
  type: ErrorType
  message: string
  originalError?: unknown
  retryable: boolean
  action?: () => void
}

/**
 * Classify an error and return a user-friendly AppError
 */
export function classifyError(error: unknown): AppError {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: ErrorType.NETWORK,
      message: '网络连接失败，请检查您的网络连接',
      originalError: error,
      retryable: true,
    }
  }

  // Supabase auth errors
  if (isSupabaseError(error)) {
    const supabaseError = error as any

    // Auth specific errors
    if (supabaseError.message?.includes('Invalid login credentials')) {
      return {
        type: ErrorType.AUTH,
        message: '邮箱或密码不正确',
        originalError: error,
        retryable: false,
      }
    }

    if (supabaseError.message?.includes('Email not confirmed')) {
      return {
        type: ErrorType.AUTH,
        message: '请先验证您的邮箱地址',
        originalError: error,
        retryable: false,
      }
    }

    if (supabaseError.message?.includes('User already registered')) {
      return {
        type: ErrorType.AUTH,
        message: '该邮箱已被注册',
        originalError: error,
        retryable: false,
      }
    }

    if (
      supabaseError.message?.includes('JWT expired') ||
      supabaseError.message?.includes('session_not_found')
    ) {
      return {
        type: ErrorType.AUTH,
        message: '会话已过期，请重新登录',
        originalError: error,
        retryable: false,
      }
    }

    // Permission errors
    if (supabaseError.code === 'PGRST301' || supabaseError.message?.includes('permission denied')) {
      return {
        type: ErrorType.PERMISSION,
        message: '您没有权限执行此操作',
        originalError: error,
        retryable: false,
      }
    }

    // Database connection errors
    if (
      supabaseError.message?.includes('connection') ||
      supabaseError.message?.includes('timeout')
    ) {
      return {
        type: ErrorType.DATABASE,
        message: '数据库连接失败，请稍后重试',
        originalError: error,
        retryable: true,
      }
    }

    // Generic database error
    return {
      type: ErrorType.DATABASE,
      message: '数据库操作失败，请稍后重试',
      originalError: error,
      retryable: true,
    }
  }

  // Realtime errors
  if (error instanceof Error && error.message.includes('realtime')) {
    return {
      type: ErrorType.REALTIME,
      message: '实时连接断开，正在重新连接...',
      originalError: error,
      retryable: true,
    }
  }

  // Validation errors
  if (error instanceof Error && error.message.includes('validation')) {
    return {
      type: ErrorType.VALIDATION,
      message: error.message,
      originalError: error,
      retryable: false,
    }
  }

  // Unknown errors
  return {
    type: ErrorType.UNKNOWN,
    message: '发生未知错误，请稍后重试',
    originalError: error,
    retryable: true,
  }
}

/**
 * Check if an error is a Supabase error
 */
function isSupabaseError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('message' in error || 'code' in error || 'details' in error)
  )
}

/**
 * Log error to console in development, could be extended to send to error tracking service
 */
export function logError(error: AppError, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${error.type}] ${context || 'Error'}:`, error.message)
    if (error.originalError) {
      console.error('Original error:', error.originalError)
    }
  }

  // In production, you could send to Sentry or other error tracking service
  // Example: Sentry.captureException(error.originalError, { tags: { type: error.type, context } })
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const appError = classifyError(error)

      // Don't retry if error is not retryable
      if (!appError.retryable) {
        throw error
      }

      // Don't retry on last attempt
      if (i === maxRetries - 1) {
        throw error
      }

      // Wait with exponential backoff
      const delay = initialDelay * Math.pow(2, i)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

/**
 * Wait for network to be online
 */
export function waitForOnline(): Promise<void> {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve()
      return
    }

    const handleOnline = () => {
      window.removeEventListener('online', handleOnline)
      resolve()
    }

    window.addEventListener('online', handleOnline)
  })
}
