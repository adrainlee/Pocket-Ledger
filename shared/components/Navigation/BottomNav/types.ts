import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react'

export interface NavItem {
  href: string
  label: string
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined
      titleId?: string | undefined
    } & RefAttributes<SVGSVGElement>
  >
}

export interface BottomNavProps {
  items: NavItem[]
}
