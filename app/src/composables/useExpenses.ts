import { readonly, ref } from 'vue'
import type { Expense } from '../types'

const expenses = ref<Expense[]>([])

export function useExpenses() {
  function addExpense(data: Omit<Expense, 'id' | 'createdAt'>) {
    expenses.value.unshift({
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    })
  }

  function updateExpense(updated: Expense) {
    expenses.value = expenses.value.map((e) => (e.id === updated.id ? updated : e))
  }

  function deleteExpense(id: string) {
    expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  return { expenses: readonly(expenses), addExpense, updateExpense, deleteExpense }
}
