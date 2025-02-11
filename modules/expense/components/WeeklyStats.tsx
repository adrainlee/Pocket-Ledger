'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card'
import type { WeeklyStats as WeeklyStatsType } from '../types'
import { formatCurrency, formatPercentage } from '@/shared/utils/currency'
import { formatDate } from '@/shared/utils/date'
import { CATEGORY_LABELS } from '../types'

interface WeeklyStatsProps {
  stats: WeeklyStatsType
  isLoading?: boolean
}

export function WeeklyStats({ stats, isLoading }: WeeklyStatsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>本周支出</CardTitle>
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
        <CardTitle>本周支出</CardTitle>
        <p className="text-sm text-foreground/60">
          {formatDate(stats.startDate)} - {formatDate(stats.endDate)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
          <div className="space-y-2">
            {stats.categories.map(({ category, amount, percentage }) => (
              <div
                key={category}
                className="flex items-center justify-between p-2 even:bg-gray-50 rounded"
              >
                <span className="text-sm">{CATEGORY_LABELS[category]}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                  <span className="text-sm text-foreground/60">
                    {formatPercentage(amount, stats.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
