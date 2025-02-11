'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/utils/cn'
import type { BottomNavProps } from './types'

export const BottomNav = ({ items }: BottomNavProps) => {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="container flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center px-3 py-2 text-sm',
                'transition-colors duration-200',
                isActive ? 'text-primary' : 'text-foreground/60 hover:text-foreground/80'
              )}
            >
              <item.icon
                className={cn(
                  'h-6 w-6',
                  isActive ? 'text-primary' : 'text-foreground/60'
                )}
              />
              <span className="mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
