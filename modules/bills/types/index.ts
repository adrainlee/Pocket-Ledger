import { Expense } from '@prisma/client'

export interface BillItemProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (id: number) => void
}

export interface MonthPickerProps {
  value: Date
  onChange: (date: Date) => void
}

export interface BillListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: number) => void
}

export interface EditExpenseDialogProps {
  expense: Expense | null
  isOpen: boolean
  onClose: () => void
  onSave: (expense: Expense) => void
}
