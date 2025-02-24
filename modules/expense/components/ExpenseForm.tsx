'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card'
import { formatDate } from '@/shared/utils/date'
import { useCategories } from '../hooks/useCategories'
import { BUILTIN_CATEGORIES } from '../types'

interface ExpenseFormProps {
  onSubmit: (data: {
    amount: number
    category: string
    date: Date
    note?: string
  }) => Promise<void>
  isLoading?: boolean
}

export function ExpenseForm({ onSubmit, isLoading }: ExpenseFormProps) {
  const [amount, setAmount] = useState<string>('')
  const [category, setCategory] = useState<string>('FOOD')
  const [date, setDate] = useState<string>(formatDate(new Date()))
  const [note, setNote] = useState<string>('')
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  // 确保总是有可用的分类选项
  const availableCategories: Array<{ key: string; label: string }> = isCategoriesLoading
    ? Object.entries(BUILTIN_CATEGORIES).map(([key, label]) => ({ key, label }))
    : categories

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return

    await onSubmit({
      amount: parseFloat(amount),
      category,
      date: new Date(date),
      note: note || undefined,
    })

    // Reset form
    setAmount('')
    setCategory('FOOD')
    setDate(formatDate(new Date()))
    setNote('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>记录支出</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">金额</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="请输入金额"
              className="w-full rounded border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={isCategoriesLoading}
            >
              {availableCategories.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">日期</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">备注</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注(可选)"
              rows={2}
              className="w-full rounded border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 px-4 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                加载中...
              </span>
            ) : (
              '保存'
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
