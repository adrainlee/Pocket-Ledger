import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getCurrentWeekRange, getCurrentMonthRange } from '@/shared/utils/date'
import type { Expense } from '@prisma/client'
import { CATEGORY_LABELS } from '@/modules/expense/types'

// 获取分类标签映射
const getCategoryLabels = async () => {
  // 获取内置分类
  const builtInLabels = { ...CATEGORY_LABELS }

  // 获取自定义分类
  const customCategories = await prisma.category.findMany({
    select: {
      key: true,
      label: true,
    },
  })

  // 合并内置分类和自定义分类
  const allLabels: Record<string, string> = { ...builtInLabels }
  customCategories.forEach((category) => {
    allLabels[category.key] = category.label
  })

  return allLabels
}

// Helper function to calculate stats
const calculateStats = async (expenses: Expense[]) => {
  const categoryLabels = await getCategoryLabels()

  const mappedExpenses = expenses.map((e) => ({
    id: e.id,
    amount: Number(e.amount),
    category: e.category,
    categoryLabel: categoryLabels[e.category] || e.category, // 使用标签，如果没有则使用原始值
    date: e.date,
    note: e.note || undefined,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  }))

  const total = mappedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryMap = new Map<string, number>()

  mappedExpenses.forEach((expense) => {
    const categoryKey = expense.categoryLabel // 使用分类标签而不是key
    const current = categoryMap.get(categoryKey) || 0
    categoryMap.set(categoryKey, current + expense.amount)
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
    const [dailyStats, weeklyStats, monthlyStats] = await Promise.all([
      calculateStats(dailyExpenses).then(stats => ({
        ...stats,
        date: today,
      })),
      calculateStats(weeklyExpenses).then(stats => ({
        ...stats,
        startDate: weekRange.startDate,
        endDate: weekRange.endDate,
      })),
      calculateStats(monthlyExpenses).then(stats => ({
        ...stats,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      }))
    ])

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
