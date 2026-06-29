import { readonly, ref, watch } from 'vue'
import type { Expense } from '../types'

const STORAGE_KEY = 'expenses'

function loadFromStorage(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return []
    return JSON.parse(raw) as Expense[]
  } catch {
    return []
  }
}

const expenses = ref<Expense[]>(loadFromStorage())

watch(
  expenses,
  (newExpenses) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses))
    } catch {
      // toast komt in taak 5.4
    }
  },
  { deep: true },
)

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
