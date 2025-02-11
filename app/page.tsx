'use client'

import { useEffect } from 'react'
import { ExpenseForm } from '@/modules/expense/components/ExpenseForm'
import { DailyStats } from '@/modules/expense/components/DailyStats'
import { WeeklyStats } from '@/modules/expense/components/WeeklyStats'
import { MonthlyStats } from '@/modules/expense/components/MonthlyStats'
import { useExpenseStats } from '@/modules/expense/hooks/useExpenseStats'

export default function ExpensePage() {
  const {
    dailyStats,
    weeklyStats,
    monthlyStats,
    isLoading,
    isSubmitting,
    fetchStats,
    addExpense,
  } = useExpenseStats()

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">记账</h1>
      </div>

      <ExpenseForm onSubmit={addExpense} isLoading={isSubmitting} />

      <DailyStats
        stats={
          dailyStats || {
            total: 0,
            categories: [],
            date: new Date(),
          }
        }
        isLoading={isLoading}
      />

      <WeeklyStats
        stats={
          weeklyStats || {
            total: 0,
            categories: [],
            startDate: new Date(),
            endDate: new Date(),
          }
        }
        isLoading={isLoading}
      />

      <MonthlyStats
        stats={
          monthlyStats || {
            total: 0,
            categories: [],
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
          }
        }
        isLoading={isLoading}
      />
    </div>
  )
}
