import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { BottomNav } from '@/shared/components/Navigation/BottomNav'
import { navigationItems } from '@/shared/config/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '个人记账应用',
  description: '一个简洁实用的个人记账应用,专注于支出记录和统计功能。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <main className="container py-4 mb-20">{children}</main>
        <BottomNav items={navigationItems} />
      </body>
    </html>
  )
}
