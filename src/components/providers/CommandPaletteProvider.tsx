'use client'

import { ReactNode, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useCommandPalette } from '@/lib/hooks/useCommandPalette'

// Dynamically import CommandPalette to reduce initial bundle size
const CommandPalette = dynamic(
  () =>
    import('@/components/features/CommandPalette').then((mod) => ({ default: mod.CommandPalette })),
  { ssr: false }
)

interface CommandPaletteProviderProps {
  children: ReactNode
}

export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const { isOpen, close } = useCommandPalette()

  return (
    <>
      {children}
      {isOpen && (
        <Suspense fallback={null}>
          <CommandPalette isOpen={isOpen} onClose={close} />
        </Suspense>
      )}
    </>
  )
}
