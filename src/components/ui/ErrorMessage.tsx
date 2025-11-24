'use client'

import { AppError, ErrorType } from '@/lib/utils/errors'
import { Button } from './Button'

interface ErrorMessageProps {
  error: AppError | string
  onRetry?: () => void
  className?: string
}

/**
 * Reusable error message component
 * Displays user-friendly error messages with optional retry button
 */
export function ErrorMessage({ error, onRetry, className = '' }: ErrorMessageProps) {
  const appError =
    typeof error === 'string'
      ? { type: ErrorType.UNKNOWN, message: error, retryable: false }
      : error

  const getIcon = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        )
      case ErrorType.AUTH:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        )
      case ErrorType.PERMISSION:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        )
      default:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  return (
    <div
      className={`rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-red-600 dark:text-red-400">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-sm text-red-800 dark:text-red-200">{appError.message}</p>
          {appError.retryable && onRetry && (
            <Button onClick={onRetry} variant="secondary" size="sm" className="mt-3">
              重试
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
