import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getCurrentWeekRange, getCurrentMonthRange } from '@/shared/utils/date'
import type { Expense } from '@prisma/client'

// Helper function to calculate stats
const calculateStats = (expenses: Expense[]) => {
  const mappedExpenses = expenses.map((e) => ({
    id: e.id,
    amount: Number(e.amount),
    category: e.category,
    date: e.date,
    note: e.note || undefined,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  }))

  const total = mappedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryMap = new Map<string, number>()

  mappedExpenses.forEach((expense) => {
    const current = categoryMap.get(expense.category) || 0
    categoryMap.set(expense.category, current + expense.amount)
  })

  const categories = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / total) * 100,
  }))

  return {
    total,
    categories,
  }
}

export async function GET() {
  try {
    const date = new Date()
    const monthRange = getCurrentMonthRange()
    const weekRange = getCurrentWeekRange()
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    // Get all expenses for the current month
    const monthlyExpenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: monthRange.startDate,
          lte: monthRange.endDate,
        },
      },
    })

    // Filter expenses for different time periods
    const weeklyExpenses = monthlyExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= weekRange.startDate && expenseDate <= weekRange.endDate
    })

    const dailyExpenses = monthlyExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getFullYear() === today.getFullYear() &&
        expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getDate() === today.getDate()
      )
    })

    // Calculate stats
    const weeklyStats = {
      ...calculateStats(weeklyExpenses),
      startDate: weekRange.startDate,
      endDate: weekRange.endDate,
    }

    const monthlyStats = {
      ...calculateStats(monthlyExpenses),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    }

    const dailyStats = {
      ...calculateStats(dailyExpenses),
      date: today,
    }

    return NextResponse.json({
      daily: dailyStats,
      weekly: weeklyStats,
      monthly: monthlyStats,
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 })
  }
}
