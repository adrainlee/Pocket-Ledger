import { ExpenseCategory as PrismaExpenseCategory } from '@prisma/client'

export type ExpenseCategory =
  | 'FOOD'
  | 'TRANSPORT'
  | 'MEDICAL'
  | 'JD'
  | 'TAOBAO'
  | 'PDD'
  | 'SUPERMARKET'
  | 'HOUSING'
  | 'COMM'
  | 'OTHER'

export interface Expense {
  id: number
  amount: number
  category: ExpenseCategory
  date: Date
  note?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateExpenseDTO {
  amount: number
  category: ExpenseCategory
  date: Date
  note?: string
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {
  id: number
}

export interface ExpenseStats {
  total: number
  categories: {
    category: ExpenseCategory
    amount: number
    percentage: number
  }[]
}

export interface DailyStats extends ExpenseStats {
  date: Date
}

export interface WeeklyStats extends ExpenseStats {
  startDate: Date
  endDate: Date
}

export interface MonthlyStats extends ExpenseStats {
  year: number
  month: number
}

export interface ExpenseFilters {
  startDate?: Date
  endDate?: Date
  category?: ExpenseCategory
}

export interface BillsQueryParams {
  year: number
  month: number
}

// Category mapping for display
export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  FOOD: '餐饮',
  TRANSPORT: '交通',
  MEDICAL: '医疗',
  JD: '京东',
  TAOBAO: '淘宝',
  PDD: '拼多多',
  SUPERMARKET: '商超',
  HOUSING: '居住',
  COMM: '通讯',
  OTHER: '其他',
}

export interface CategoryItem {
  key: string
  label: string
}


export type CategoryKey = keyof typeof CATEGORY_LABELS
