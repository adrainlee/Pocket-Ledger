import { Expense } from '@prisma/client'

export const billService = {
  // Get expenses for a specific month
  async getMonthlyExpenses(date: Date): Promise<Expense[]> {
    const response = await fetch(`/api/expenses?date=${date.toISOString()}`, {
      method: 'GET',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '获取支出记录失败')
    }

    return response.json()
  },

  // Update an expense
  async updateExpense(
    id: number,
    data: Pick<Expense, 'amount' | 'category' | 'date' | 'note'>
  ): Promise<Expense> {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '更新支出失败')
    }

    return response.json()
  },

  // Delete an expense
  async deleteExpense(id: number): Promise<void> {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '删除支出失败')
    }
  },
}
