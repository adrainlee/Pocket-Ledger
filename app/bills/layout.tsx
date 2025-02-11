import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '账单 - 个人记账应用',
  description: '查看和管理支出记录。',
}

export default function BillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
