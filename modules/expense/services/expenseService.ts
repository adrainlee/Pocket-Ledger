import type {
  CreateExpenseDTO,
  UpdateExpenseDTO,
  ExpenseFilters,
  BillsQueryParams,
  WeeklyStats,
  MonthlyStats,
  ExpenseCategory,
  Expense,
} from '../types'
import {
  getMonthRange,
  getCurrentWeekRange,
  getCurrentMonthRange,
} from '@/shared/utils/date'
import { prisma } from '@/lib/db'

// Helper to parse expense data from API response
const parseExpense = (data: any): Expense => ({
  id: data.id,
  amount: Number(data.amount),
  category: data.category,
  date: new Date(data.date),
  note: data.note || undefined,
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt),
})

// Helper function to calculate stats
const calculateStats = (expenses: Expense[]) => {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryMap = new Map<ExpenseCategory, number>()

  expenses.forEach((expense) => {
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

export const expenseService = {
  // Create a new expense
  async createExpense(data: CreateExpenseDTO) {
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
      throw new Error(error.error || '创建支出失败')
    }

    const expense = await response.json()
    return parseExpense(expense)
  },

  // Get expense by ID
  async getExpenseById(id: number) {
    const response = await fetch(`/api/expenses/${id}`)
    if (!response.ok) {
      if (response.status === 404) return null
      const error = await response.json()
      throw new Error(error.error || '获取支出失败')
    }
    const expense = await response.json()
    return parseExpense(expense)
  },

  // Update expense
  async updateExpense({ id, ...data }: UpdateExpenseDTO) {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.date !== undefined && { date: data.date.toISOString() }),
        ...(data.note !== undefined && { note: data.note }),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '更新支出失败')
    }

    const expense = await response.json()
    return parseExpense(expense)
  },

  // Delete expense
  async deleteExpense(id: number) {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '删除支出失败')
    }
  },

  // Get expenses with filters
  async getExpenses(filters: ExpenseFilters) {
    const searchParams = new URLSearchParams()

    if (filters.startDate) {
      searchParams.set('startDate', filters.startDate.toISOString())
    }
    if (filters.endDate) {
      searchParams.set('endDate', filters.endDate.toISOString())
    }
    if (filters.category) {
      searchParams.set('category', filters.category)
    }

    const response = await fetch(`/api/expenses?${searchParams.toString()}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '获取支出列表失败')
    }

    const expenses = await response.json()
    return expenses.map(parseExpense)
  },

  // Get bills by month
  async getBills({ year, month }: BillsQueryParams) {
    const { startDate, endDate } = getMonthRange(year, month)
    return this.getExpenses({ startDate, endDate })
  },

  // Calculate weekly stats
  async getWeeklyStats(): Promise<WeeklyStats> {
    const { startDate, endDate } = getCurrentWeekRange()
    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const mappedExpenses = expenses.map((e) => ({
      ...e,
      amount: Number(e.amount),
      note: e.note || undefined,
    }))

    return {
      ...calculateStats(mappedExpenses),
      startDate,
      endDate,
    }
  },

  // Calculate monthly stats
  async getMonthlyStats(): Promise<MonthlyStats> {
    const { startDate, endDate } = getCurrentMonthRange()
    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const mappedExpenses = expenses.map((e) => ({
      ...e,
      amount: Number(e.amount),
      note: e.note || undefined,
    }))

    const date = new Date()
    return {
      ...calculateStats(mappedExpenses),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    }
  },
}
