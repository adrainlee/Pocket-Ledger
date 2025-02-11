'use client'

import { Card } from '@/shared/components/ui/Card'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@/shared/components/ui/Button'
import { BillListProps } from '../types'
import { formatCurrency } from '@/shared/utils/currency'
import { CATEGORY_LABELS } from '@/modules/expense/types'

export function BillList({ expenses, onEdit, onDelete }: BillListProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <div className="flex h-32 items-center justify-center text-gray-500">
          暂无支出记录
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense.id}>
          <div className="p-4 even:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">
                  {formatCurrency(Number(expense.amount))}
                </div>
                <div className="text-sm text-gray-500">
                  {CATEGORY_LABELS[expense.category]}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(expense)}
                  aria-label="编辑"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  aria-label="删除"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {format(expense.date, 'yyyy年MM月dd日', { locale: zhCN })}
              {expense.note && ` · ${expense.note}`}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
