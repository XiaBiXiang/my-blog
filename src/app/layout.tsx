import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { CommandPaletteProvider } from '@/components/providers/CommandPaletteProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { NetworkStatus } from '@/components/ui/NetworkStatus'

export const metadata: Metadata = {
  title: {
    default: 'Portfolio Site',
    template: '%s | Portfolio Site',
  },
  description: 'Modern portfolio website with Glassmorphism and Bento Grid design',
  keywords: ['portfolio', 'web development', 'design', 'projects'],
  authors: [{ name: 'Portfolio Owner' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: 'Portfolio Site',
    description: 'Modern portfolio website with Glassmorphism and Bento Grid design',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <CommandPaletteProvider>
                  <NetworkStatus />
                  {children}
                </CommandPaletteProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
