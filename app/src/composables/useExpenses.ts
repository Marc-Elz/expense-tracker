import { ref, watch } from 'vue'
import type { Expense } from '../types'

const STORAGE_KEY = 'expenses'

function loadFromStorage(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw !== null ? (JSON.parse(raw) as Expense[]) : []
  } catch {
    return []
  }
}

export function useExpenses() {
  const expenses = ref<Expense[]>(loadFromStorage())

  watch(
    expenses,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Storage error (incl. QuotaExceededError) — toast notification in fase 5
      }
    },
    { deep: true },
  )

  function addExpense(expense: Expense): void {
    expenses.value.push(expense)
  }

  function updateExpense(updated: Expense): void {
    const index = expenses.value.findIndex((e) => e.id === updated.id)
    if (index !== -1) {
      expenses.value[index] = updated
    }
  }

  function deleteExpense(id: string): void {
    expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  return { expenses, addExpense, updateExpense, deleteExpense }
}
