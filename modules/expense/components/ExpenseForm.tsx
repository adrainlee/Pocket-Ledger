'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card'
import { formatDate } from '@/shared/utils/date'
import { ExpenseCategory } from '@prisma/client'
import { useCategories } from '../hooks/useCategories'
import { CATEGORY_LABELS } from '../types'

interface ExpenseFormProps {
  onSubmit: (data: {
    amount: number
    category: ExpenseCategory
    date: Date
    note?: string
  }) => Promise<void>
  isLoading?: boolean
}

export function ExpenseForm({ onSubmit, isLoading }: ExpenseFormProps) {
  const [amount, setAmount] = useState<string>('')
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD)
  const [date, setDate] = useState<string>(formatDate(new Date()))
  const [note, setNote] = useState<string>('')
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  // 确保总是有可用的分类选项
  const availableCategories = isCategoriesLoading ?
    Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label })) :
    categories

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
    setCategory(ExpenseCategory.FOOD)
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
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
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

          <Button type="submit" fullWidth isLoading={isLoading}>
            保存
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
