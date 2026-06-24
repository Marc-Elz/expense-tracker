import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Expense, Filters } from '../types'

export function useFilters(expenses: Ref<Expense[]>) {
  const filters = ref<Filters>({
    category: 'All',
    sortField: 'date',
    sortOrder: 'desc',
  })

  const filteredExpenses = computed((): Expense[] => {
    let result = [...expenses.value]

    if (filters.value.category !== 'All') {
      const cat = filters.value.category
      result = result.filter((e) => e.category === cat)
    }

    const { sortField, sortOrder } = filters.value
    const direction = sortOrder === 'asc' ? 1 : -1

    result.sort((a, b) =>
      sortField === 'date'
        ? a.date.localeCompare(b.date) * direction
        : (a.amount - b.amount) * direction,
    )

    return result
  })

  return { filters, filteredExpenses }
}
