import { computed, ref } from 'vue'
import type { Filters } from '../types'
import { useExpenses } from './useExpenses'

export function useFilters() {
  const { expenses } = useExpenses()
  const filters = ref<Filters>({ category: 'All', sortField: 'date', sortOrder: 'desc' })

  const filteredExpenses = computed(() => {
    let result = expenses.value.slice()

    if (filters.value.category !== 'All') {
      result = result.filter((e) => e.category === filters.value.category)
    }

    result.sort((a, b) => {
      const dir = filters.value.sortOrder === 'asc' ? 1 : -1
      if (filters.value.sortField === 'date') {
        return a.date.localeCompare(b.date) * dir
      }
      return (a.amount - b.amount) * dir
    })

    return result
  })

  return { filters, filteredExpenses }
}
