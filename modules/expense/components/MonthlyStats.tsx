'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card'
import type { MonthlyStats as MonthlyStatsType } from '../types'
import { formatCurrency, formatPercentage } from '@/shared/utils/currency'
import { formatMonthYear } from '@/shared/utils/date'
import { useCategoryLabels } from '../hooks/useCategoryLabels'

interface MonthlyStatsProps {
  stats: MonthlyStatsType
  isLoading?: boolean
}

export function MonthlyStats({ stats, isLoading }: MonthlyStatsProps) {
  const { categoryLabels, isLoading: isLoadingLabels } = useCategoryLabels()

  if (isLoading || isLoadingLabels) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>本月支出</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <span className="text-foreground/60">加载中...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>本月支出</CardTitle>
        <p className="text-sm text-foreground/60">
          {formatMonthYear(new Date(stats.year, stats.month - 1))}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
          <div className="space-y-3">
            {stats.categories.map(({ category, amount, percentage }) => (
              <div key={category} className="space-y-1 p-2 even:bg-gray-50 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{categoryLabels[category] || category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                    <span className="text-sm text-foreground/60 w-14 text-right">
                      {formatPercentage(amount, stats.total)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
