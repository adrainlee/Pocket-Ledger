'use client'

import { Card } from '@/shared/components/ui/Card'
import type { DailyStats as DailyStatsType } from '../types'
import { CATEGORY_LABELS } from '../types'
import { format } from 'date-fns'

interface Props {
  stats: DailyStatsType
  isLoading: boolean
}

export function DailyStats({ stats, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card>
        <div className="p-4">
          <div className="animate-pulse bg-gray-200 h-6 w-24 mb-2"></div>
          <div className="animate-pulse bg-gray-200 h-8 w-32"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">今日支出</h2>
          <span className="text-sm text-gray-500">
            {format(stats.date, 'yyyy-MM-dd')}
          </span>
        </div>
        <p className="text-2xl font-bold">¥{stats.total.toFixed(2)}</p>
        {stats.categories.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">支出分类</h3>
            <div className="space-y-2">
              {stats.categories.map(({ category, amount, percentage }) => (
                <div
                  key={category}
                  className="flex items-center justify-between text-sm p-2 even:bg-gray-50"
                >
                  <span>{CATEGORY_LABELS[category]}</span>
                  <span className="text-gray-500">
                    ¥{amount.toFixed(2)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
