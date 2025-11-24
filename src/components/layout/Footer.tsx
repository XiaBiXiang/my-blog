'use client'

import Link from 'next/link'
import { GlassCard } from '@/components/animations/GlassCard'

const footerLinks = {
  navigation: [
    { href: '/', label: '首页' },
    { href: '/about', label: '关于' },
    { href: '/projects', label: '项目' },
    { href: '/skills', label: '技能' },
  ],
  social: [
    { href: '/guestbook', label: '留言板' },
    { href: '/capsule', label: '时间胶囊' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto w-full px-4 pb-4 md:px-6 md:pb-6">
      <GlassCard className="px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <h3 className="mb-3 text-xl font-bold">Portfolio</h3>
              <p className="text-sm text-foreground/70">
                现代化的个人作品集网站，展示技术与创意的完美结合。
              </p>
            </div>

            {/* Navigation Links */}
            <div className="col-span-1">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/80">
                导航
              </h4>
              <ul className="space-y-2">
                {footerLinks.navigation.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="col-span-1">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/80">
                互动
              </h4>
              <ul className="space-y-2">
                {footerLinks.social.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Info */}
            <div className="col-span-1">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/80">
                快捷键
              </h4>
              <div className="space-y-2 text-sm text-foreground/70">
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-white/10 px-2 py-1 text-xs">⌘K</kbd>
                  <span>命令面板</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-white/10 px-2 py-1 text-xs">⌘/</kbd>
                  <span>搜索</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 border-t border-border/50 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-foreground/60 md:text-left">
                © {currentYear} Portfolio. Built with Next.js & Supabase.
              </p>
              <div className="flex items-center gap-4 text-sm text-foreground/60">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </footer>
  )
}
