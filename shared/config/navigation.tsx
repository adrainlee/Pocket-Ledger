'use client'

import {
  BanknotesIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import type { NavItem } from '@/shared/components/Navigation/BottomNav/types'

export const navigationItems: NavItem[] = [
  {
    href: '/',
    label: '记账',
    icon: BanknotesIcon,
  },
  {
    href: '/bills',
    label: '账单',
    icon: DocumentTextIcon,
  },
  {
    href: '/settings',
    label: '设置',
    icon: Cog6ToothIcon,
  },
]
