/**
 * Dynamic import utilities for code splitting
 * Use these to lazy-load heavy components and improve initial bundle size
 */

/**
 * Preload a component in the background
 * Useful for components that will likely be needed soon
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  if (typeof window !== 'undefined') {
    // Use requestIdleCallback to preload during idle time
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        importFn().catch(() => {
          // Silently fail - component will be loaded when actually needed
        })
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        importFn().catch(() => {})
      }, 1)
    }
  }
}

/**
 * Example usage:
 *
 * // In a component file:
 * import dynamic from 'next/dynamic'
 *
 * const HeavyComponent = dynamic(
 *   () => import('./HeavyComponent'),
 *   { ssr: false, loading: () => <Spinner /> }
 * )
 *
 * // Preload when likely to be needed:
 * import { preloadComponent } from '@/lib/utils/dynamicImports'
 *
 * useEffect(() => {
 *   preloadComponent(() => import('./HeavyComponent'))
 * }, [])
 */
