'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/animations/GlassCard'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于' },
  { href: '/projects', label: '项目' },
  { href: '/skills', label: '技能' },
  { href: '/guestbook', label: '留言板' },
  { href: '/capsule', label: '时间胶囊' },
]

export function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full">
      <GlassCard className="mx-4 mt-4 md:mx-6 md:mt-6">
        <nav className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold md:text-2xl">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              Portfolio
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-foreground/70'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                {/* User Welcome Message */}
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
                  <span className="text-sm text-foreground/70">欢迎,</span>
                  <span className="text-sm font-medium text-primary">
                    {user.username || user.email?.split('@')[0] || '用户'}
                  </span>
                  <span className="text-lg">👋</span>
                </div>

                {user.role === 'admin' && (
                  <Link href="/admin/capsule">
                    <Button variant="ghost" size="sm">
                      管理
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  登出
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">注册</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 px-4 py-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 flex flex-col gap-2 border-t border-border/50 pt-3">
                {user ? (
                  <>
                    {/* Mobile User Welcome */}
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                      <span className="text-sm text-foreground/70">欢迎,</span>
                      <span className="text-sm font-medium text-primary">
                        {user.username || user.email?.split('@')[0] || '用户'}
                      </span>
                      <span className="text-lg">👋</span>
                    </div>

                    {user.role === 'admin' && (
                      <Link href="/admin/capsule" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full">
                          管理
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full"
                    >
                      登出
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        登录
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full">
                        注册
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </header>
  )
}
