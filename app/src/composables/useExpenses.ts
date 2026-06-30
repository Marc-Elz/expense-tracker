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
const storageError = ref<string | null>(null)

let lastPersisted = JSON.stringify(expenses.value)
let isReverting = false

watch(
  expenses,
  (newExpenses) => {
    if (isReverting) {
      isReverting = false
      return
    }
    try {
      const serialized = JSON.stringify(newExpenses)
      localStorage.setItem(STORAGE_KEY, serialized)
      lastPersisted = serialized
      storageError.value = null
    } catch (err) {
      storageError.value =
        err instanceof DOMException && err.name === 'QuotaExceededError'
          ? 'Opslag is vol. De wijziging kon niet worden opgeslagen.'
          : 'Er ging iets mis bij het opslaan van je wijziging.'
      isReverting = true
      expenses.value = JSON.parse(lastPersisted) as Expense[]
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

  function clearStorageError() {
    storageError.value = null
  }

  return {
    expenses: readonly(expenses),
    addExpense,
    updateExpense,
    deleteExpense,
    storageError: readonly(storageError),
    clearStorageError,
  }
}
