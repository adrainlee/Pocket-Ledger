import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd', { locale: zhCN })
}

export const formatDateTime = (date: Date): string => {
  return format(date, 'yyyy-MM-dd HH:mm', { locale: zhCN })
}

export const formatMonthYear = (date: Date): string => {
  return format(date, 'yyyy年MM月', { locale: zhCN })
}

export const getCurrentWeekRange = () => {
  const now = new Date()
  return {
    startDate: startOfWeek(now, { locale: zhCN }),
    endDate: endOfWeek(now, { locale: zhCN }),
  }
}

export const getCurrentMonthRange = () => {
  const now = new Date()
  return {
    startDate: startOfMonth(now),
    endDate: endOfMonth(now),
  }
}

export const getMonthRange = (year: number, month: number) => {
  const date = new Date(year, month - 1)
  return {
    startDate: startOfMonth(date),
    endDate: endOfMonth(date),
  }
}
