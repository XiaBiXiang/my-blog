'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useThemeStore } from '@/stores/themeStore'

export interface Command {
  id: string
  label: string
  description?: string
  icon?: string
  action: () => void
  keywords: string[]
  category: 'navigation' | 'theme' | 'action'
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const { toggleTheme, theme } = useThemeStore()

  // Define all available commands
  const commands: Command[] = useMemo(
    () => [
      // Navigation commands
      {
        id: 'nav-home',
        label: '首页',
        description: '返回首页',
        icon: '🏠',
        action: () => {
          router.push('/')
          onClose()
        },
        keywords: ['home', '首页', '主页'],
        category: 'navigation',
      },
      {
        id: 'nav-guestbook',
        label: '留言板',
        description: '查看和发表留言',
        icon: '💬',
        action: () => {
          router.push('/guestbook')
          onClose()
        },
        keywords: ['guestbook', '留言板', '留言', 'message'],
        category: 'navigation',
      },
      {
        id: 'nav-capsule',
        label: '时间胶囊',
        description: '查看时间胶囊',
        icon: '⏰',
        action: () => {
          router.push('/capsule')
          onClose()
        },
        keywords: ['capsule', '时间胶囊', '胶囊', 'time'],
        category: 'navigation',
      },
      {
        id: 'nav-admin-capsule',
        label: '管理时间胶囊',
        description: '管理时间胶囊内容',
        icon: '⚙️',
        action: () => {
          router.push('/admin/capsule')
          onClose()
        },
        keywords: ['admin', 'capsule', '管理', '时间胶囊', '后台'],
        category: 'navigation',
      },
      {
        id: 'nav-login',
        label: '登录',
        description: '登录账户',
        icon: '🔑',
        action: () => {
          router.push('/login')
          onClose()
        },
        keywords: ['login', '登录', 'signin'],
        category: 'navigation',
      },
      {
        id: 'nav-register',
        label: '注册',
        description: '创建新账户',
        icon: '📝',
        action: () => {
          router.push('/register')
          onClose()
        },
        keywords: ['register', '注册', 'signup', '创建账户'],
        category: 'navigation',
      },
      // Theme commands
      {
        id: 'theme-toggle',
        label: theme === 'dark' ? '切换到浅色模式' : '切换到深色模式',
        description: '切换网站主题',
        icon: theme === 'dark' ? '☀️' : '🌙',
        action: () => {
          toggleTheme()
          onClose()
        },
        keywords: ['theme', '主题', 'dark', 'light', '深色', '浅色', '暗色', '亮色'],
        category: 'theme',
      },
    ],
    [router, onClose, toggleTheme, theme]
  )

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands

    const searchLower = search.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(searchLower) ||
        cmd.description?.toLowerCase().includes(searchLower) ||
        cmd.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower))
    )
  }, [search, commands])

  // Reset selected index when filtered commands change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredCommands])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  // Reset search when opening/closing
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="命令面板"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Command Palette */}
      <div
        className={cn(
          'relative z-10 w-full max-w-2xl transform transition-all duration-200',
          'animate-slide-up'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-card overflow-hidden rounded-2xl shadow-2xl">
          {/* Search Input */}
          <div className="border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索命令..."
                className="flex-1 bg-transparent text-lg text-foreground placeholder-gray-500 outline-none"
                autoFocus
              />
              <kbd className="rounded bg-white/10 px-2 py-1 text-xs text-gray-400">ESC</kbd>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p>未找到匹配的命令</p>
                <p className="mt-2 text-sm">尝试其他关键词</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => command.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'w-full rounded-lg px-4 py-3 text-left transition-all duration-150',
                      'flex items-center gap-3',
                      'focus:outline-none',
                      selectedIndex === index ? 'bg-primary/20 shadow-md' : 'hover:bg-white/5'
                    )}
                  >
                    {/* Icon */}
                    {command.icon && <span className="flex-shrink-0 text-2xl">{command.icon}</span>}

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground">{command.label}</div>
                      {command.description && (
                        <div className="truncate text-sm text-gray-500">{command.description}</div>
                      )}
                    </div>

                    {/* Category Badge */}
                    <span
                      className={cn(
                        'flex-shrink-0 rounded-full px-2 py-1 text-xs font-medium',
                        command.category === 'navigation' && 'bg-blue-500/20 text-blue-400',
                        command.category === 'theme' && 'bg-purple-500/20 text-purple-400',
                        command.category === 'action' && 'bg-green-500/20 text-green-400'
                      )}
                    >
                      {command.category === 'navigation' && '导航'}
                      {command.category === 'theme' && '主题'}
                      {command.category === 'action' && '操作'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5">↑</kbd>
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5">↓</kbd>
                  <span className="ml-1">导航</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5">↵</kbd>
                  <span className="ml-1">选择</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white/10 px-1.5 py-0.5">⌘</kbd>
                <kbd className="rounded bg-white/10 px-1.5 py-0.5">K</kbd>
                <span className="ml-1">打开</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
