'use client'

import { useState, useEffect } from 'react'
import { ExpenseCategory, Prisma } from '@prisma/client'
import { Button } from '@/shared/components/ui/Button'
import { EditExpenseDialogProps } from '../types'
import { formatDate } from '@/shared/utils/date'
import { CATEGORY_LABELS } from '@/modules/expense/types'

export function ExpenseDialog({
  expense,
  isOpen,
  onClose,
  onSave,
}: EditExpenseDialogProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'FOOD' as ExpenseCategory,
    date: formatDate(new Date()),
    note: '',
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        date: formatDate(expense.date),
        note: expense.note || '',
      })
    }
  }, [expense])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expense) return

    onSave({
      ...expense,
      amount: new Prisma.Decimal(formData.amount),
      category: formData.category,
      date: new Date(formData.date),
      note: formData.note || null,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">编辑支出</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">金额</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">分类</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ExpenseCategory,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
                <option key={category} value={category}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">备注</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
