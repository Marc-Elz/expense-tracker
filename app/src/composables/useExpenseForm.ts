import { reactive } from 'vue'
import type { Category, Expense } from '../types'

export interface ExpenseFormState {
  description: string
  amount: number
  category: Category
  date: string
}

export function useExpenseForm() {
  const form = reactive<ExpenseFormState>({
    description: '',
    amount: 0,
    category: 'Other',
    date: new Date().toISOString().slice(0, 10),
  })

  function resetForm(): void {
    form.description = ''
    form.amount = 0
    form.category = 'Other'
    form.date = new Date().toISOString().slice(0, 10)
  }

  function populateForm(expense: Expense): void {
    form.description = expense.description
    form.amount = expense.amount
    form.category = expense.category
    form.date = expense.date
  }

  return { form, resetForm, populateForm }
}
