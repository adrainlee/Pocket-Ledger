'use client'

import { useState, useEffect, useCallback } from 'react'
import { Expense } from '@prisma/client'
import { billService } from '../services/billService'

export function useBillList(initialDate: Date = new Date()) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [error, setError] = useState<Error | null>(null)

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await billService.getMonthlyExpenses(selectedDate)
      setExpenses(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取账单失败'))
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const handleEdit = async (expense: Expense) => {
    try {
      await billService.updateExpense(expense.id, {
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        note: expense.note,
      })
      await fetchExpenses()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('更新账单失败'))
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await billService.deleteExpense(id)
      await fetchExpenses()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('删除账单失败'))
    }
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  return {
    expenses,
    isLoading,
    error,
    selectedDate,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onDateChange: handleDateChange,
  }
}
