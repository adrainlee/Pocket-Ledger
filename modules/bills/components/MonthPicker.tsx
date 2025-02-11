'use client'

import { addMonths, format, subMonths } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { MonthPickerProps } from '../types'

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const handlePreviousMonth = () => {
    onChange(subMonths(value, 1))
  }

  const handleNextMonth = () => {
    onChange(addMonths(value, 1))
  }

  const currentMonth = format(value, 'yyyy年MM月', { locale: zhCN })

  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-2">
        <Button
          variant="outline"
          size="sm"
          className="p-1"
          onClick={handlePreviousMonth}
          aria-label="上个月"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <span className="text-lg font-medium">{currentMonth}</span>

        <Button
          variant="outline"
          size="sm"
          className="p-1"
          onClick={handleNextMonth}
          aria-label="下个月"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
