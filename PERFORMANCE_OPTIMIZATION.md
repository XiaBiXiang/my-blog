# Performance Optimization Guide

This document outlines all performance optimizations implemented in the portfolio site.

## Overview

The site is optimized to meet the following performance targets:

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.0s
- **Interaction Response Time**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## Implemented Optimizations

### 1. Image Optimization

**Implementation**: Using Next.js `next/image` component throughout the application.

**Benefits**:

- Automatic image optimization (WebP/AVIF formats)
- Lazy loading by default
- Responsive images with `sizes` attribute
- Prevents Cumulative Layout Shift (CLS)

**Files Modified**:

- `src/components/features/CapsuleEditor.tsx`
- `src/components/features/TimeCapsule.tsx`
- `src/components/features/ProjectDetail.tsx` (already optimized)

**Configuration** (`next.config.mjs`):

```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### 2. Font Optimization

**Implementation**: Using `next/font` with optimized settings.

**Benefits**:

- Self-hosted fonts (no external requests)
- Font display swap for faster text rendering
- Variable font support
- Automatic font subsetting

**Configuration** (`src/app/layout.tsx`):

```typescript
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})
```

### 3. Code Splitting & Dynamic Imports

**Implementation**: Dynamic imports for heavy components.

**Benefits**:

- Reduced initial bundle size
- Faster page load times
- Components loaded only when needed

**Files Created**:

- `src/lib/utils/dynamicImports.ts` - Utility functions for dynamic imports

**Components Optimized**:

- CommandPalette (loaded only when opened)
- Future: SkillTree with Three.js (when implemented)

**Usage Example**:

```typescript
const CommandPalette = dynamic(() => import('@/components/features/CommandPalette'), { ssr: false })
```

### 4. Static Site Generation (SSG) & Incremental Static Regeneration (ISR)

**Implementation**: SSG/ISR configured for all public pages.

**Benefits**:

- Pre-rendered pages at build time
- Instant page loads
- Automatic revalidation for fresh content

**Pages Configured**:

- Home page: `force-static` with 1-hour revalidation
- Projects list: ISR with 60-second revalidation
- Project detail: ISR with 60-second revalidation + `generateStaticParams`
- Time capsule: ISR with 5-minute revalidation

**Example** (`src/app/page.tsx`):

```typescript
export const dynamic = 'force-static'
export const revalidate = 3600 // 1 hour
```

### 5. Bundle Size Optimization

**Implementation**: Multiple strategies to reduce bundle size.

**Strategies**:

1. **Tree Shaking**: Automatic with Next.js
2. **Code Minification**: SWC minifier enabled
3. **Console Removal**: Remove console.logs in production
4. **Package Optimization**: Optimize imports for large packages
5. **Bundle Analysis**: Added `@next/bundle-analyzer`

**Configuration** (`next.config.mjs`):

```javascript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
},
swcMinify: true,
experimental: {
  optimizePackageImports: ['framer-motion', '@supabase/supabase-js'],
},
```

**Bundle Analysis**:

```bash
npm run analyze
```

### 6. Interaction Response Time Optimization

**Implementation**: Optimized UI components for < 100ms response time.

**Optimizations**:

1. **Faster Transitions**: Reduced from 150ms to 75ms
2. **Active State Feedback**: Added `active:scale-95` for immediate visual feedback
3. **Optimistic Updates**: Form submissions show immediate feedback
4. **Performance Utilities**: Created helper functions for monitoring

**Files Modified**:

- `src/components/ui/Button.tsx` - Faster transitions and active states

**Files Created**:

- `src/lib/utils/performance.ts` - Performance monitoring utilities

**Utilities Available**:

- `measurePerformance()` - Measure async operation time
- `debounce()` - Limit execution rate
- `throttle()` - Limit execution frequency
- `runWhenIdle()` - Run non-critical tasks during idle time
- `preloadImage()` - Preload images for faster display
- `prefersReducedMotion()` - Check user motion preferences

### 7. Production Optimizations

**Implementation**: Various production-specific optimizations.

**Optimizations**:

- Source maps disabled in production
- Console logs removed in production
- Automatic compression (Gzip/Brotli)
- Optimized caching headers

## Performance Monitoring

### Tools

1. **Lighthouse CI**: Run on every deployment
2. **Next.js Analytics**: Built-in performance monitoring
3. **Bundle Analyzer**: Visualize bundle composition

### Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Analyze bundle size
npm run analyze

# Type checking
npm run type-check
```

### Metrics to Monitor

1. **Core Web Vitals**:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

2. **Custom Metrics**:
   - Time to First Byte (TTFB)
   - First Contentful Paint (FCP)
   - Time to Interactive (TTI)

3. **Bundle Metrics**:
   - Total bundle size
   - First Load JS
   - Route-specific bundles

## Best Practices

### When Adding New Features

1. **Images**: Always use `next/image` component
2. **Heavy Components**: Use dynamic imports
3. **External Libraries**: Check bundle size impact
4. **Animations**: Check for reduced motion preference
5. **Data Fetching**: Use SSG/ISR when possible

### Code Examples

#### Optimized Image Usage

```typescript
import Image from 'next/image'

<Image
  src={imageUrl}
  alt="Description"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### Dynamic Import

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { ssr: false, loading: () => <Spinner /> }
)
```

#### Performance Measurement

```typescript
import { measurePerformance } from '@/lib/utils/performance'

const result = await measurePerformance('fetchData', async () => {
  return await fetchData()
})
```

## Future Optimizations

### Planned Improvements

1. **Service Worker**: Add offline support
2. **Prefetching**: Intelligent link prefetching
3. **Image CDN**: Consider using image CDN for better global performance
4. **Edge Functions**: Move some API routes to edge
5. **Partial Prerendering**: Use when stable in Next.js

### When Three.js is Added

1. Use dynamic import with `ssr: false`
2. Lazy load only when skill tree is visible
3. Consider using lower-poly models
4. Implement level-of-detail (LOD) for 3D objects
5. Use `requestIdleCallback` for non-critical 3D updates

## Troubleshooting

### Slow Page Loads

1. Check bundle size with `npm run analyze`
2. Verify images are using `next/image`
3. Check for blocking scripts
4. Review network waterfall in DevTools

### High Bundle Size

1. Run bundle analyzer
2. Check for duplicate dependencies
3. Use dynamic imports for large components
4. Review package imports (use specific imports)

### Poor Interaction Response

1. Check transition durations
2. Verify no blocking operations on main thread
3. Use performance utilities to measure
4. Consider using `requestIdleCallback` for non-critical work

## Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
