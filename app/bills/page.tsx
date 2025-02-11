'use client'

import { useState } from 'react'
import { MonthPicker } from '@/modules/bills/components/MonthPicker'
import { BillList } from '@/modules/bills/components/BillList'
import { ExpenseDialog } from '@/modules/bills/components/ExpenseDialog'
import { useBillList } from '@/modules/bills/hooks/useBillList'
import { Expense } from '@prisma/client'

export default function BillsPage() {
  const { expenses, isLoading, error, selectedDate, onEdit, onDelete, onDateChange } =
    useBillList()

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const handleSave = async (expense: Expense) => {
    await onEdit(expense)
    setEditingExpense(null)
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('确定要删除这条记录吗?')
    if (confirmed) {
      await onDelete(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">账单</h1>
      </div>

      <MonthPicker value={selectedDate} onChange={onDateChange} />

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">{error.message}</div>
      )}

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : (
        <BillList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <ExpenseDialog
        expense={editingExpense}
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        onSave={handleSave}
      />
    </div>
  )
}
