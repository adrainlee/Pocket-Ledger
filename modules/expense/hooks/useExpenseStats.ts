'use client'

import { useState, useCallback, useEffect } from 'react'
import type { WeeklyStats, MonthlyStats, DailyStats, CreateExpenseDTO } from '../types'

export function useExpenseStats() {
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null)
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null)
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setDailyStats(data.daily)
      setWeeklyStats(data.weekly)
      setMonthlyStats(data.monthly)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Add new expense
  const addExpense = async (data: CreateExpenseDTO) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          category: data.category,
          date: data.date.toISOString(),
          note: data.note,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create expense')
      }

      // Refresh stats after adding new expense
      await fetchStats()
      return response.json()
    } catch (error) {
      console.error('Failed to add expense:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    dailyStats,
    weeklyStats,
    monthlyStats,
    isLoading,
    isSubmitting,
    fetchStats,
    addExpense,
  }
}
