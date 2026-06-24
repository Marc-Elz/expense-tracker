import { ref } from 'vue'
import { useFilters } from '../useFilters'
import type { Expense } from '../../types'

function makeExpense(overrides: Partial<Expense>): Expense {
  return {
    id: 'id',
    description: 'Test',
    amount: 10,
    category: 'Food',
    date: '2024-01-15',
    createdAt: 1705276800000,
    ...overrides,
  }
}

const sampleExpenses: Expense[] = [
  makeExpense({ id: '1', category: 'Food', amount: 30, date: '2024-03-01' }),
  makeExpense({ id: '2', category: 'Transport', amount: 10, date: '2024-01-15' }),
  makeExpense({ id: '3', category: 'Food', amount: 20, date: '2024-02-10' }),
  makeExpense({ id: '4', category: 'Entertainment', amount: 50, date: '2024-04-05' }),
]

describe('useFilters', () => {
  it('returns all expenses when category is All', () => {
    const { filteredExpenses } = useFilters(ref(sampleExpenses))
    expect(filteredExpenses.value).toHaveLength(4)
  })

  it('filters by Food', () => {
    const { filters, filteredExpenses } = useFilters(ref(sampleExpenses))
    filters.value.category = 'Food'
    expect(filteredExpenses.value).toHaveLength(2)
    expect(filteredExpenses.value.every((e) => e.category === 'Food')).toBe(true)
  })

  it('filters by Transport', () => {
    const { filters, filteredExpenses } = useFilters(ref(sampleExpenses))
    filters.value.category = 'Transport'
    expect(filteredExpenses.value).toHaveLength(1)
    expect(filteredExpenses.value[0].id).toBe('2')
  })

  it('filters by Entertainment', () => {
    const { filters, filteredExpenses } = useFilters(ref(sampleExpenses))
    filters.value.category = 'Entertainment'
    expect(filteredExpenses.value).toHaveLength(1)
    expect(filteredExpenses.value[0].id).toBe('4')
  })

  it('returns empty array when no expenses match category', () => {
    const { filters, filteredExpenses } = useFilters(ref(sampleExpenses))
    filters.value.category = 'Other'
    expect(filteredExpenses.value).toHaveLength(0)
  })

  it('sorts by date descending by default', () => {
    const { filteredExpenses } = useFilters(ref(sampleExpenses))
    const dates = filteredExpenses.value.map((e) => e.date)
    expect(dates).toEqual(['2024-04-05', '2024-03-01', '2024-02-10', '2024-01-15'])
  })

  it('sorts by date ascending', () => {
    const { filters, filteredExpenses } = useFilters(ref(sampleExpenses))
    filters.value.sortOrder = 'asc'
    const dates = filteredExpenses.value.map((e) => e.date)
    expect(dates).toEqual(['2024-01-15', '2024-02-10', '2024-03-01', '2024-04-05'])
  })

  it('sorts by amount descending', () => {
    const { filters, filteredExpenses } = useFilters(ref(sampleExpenses))
    filters.value.sortField = 'amount'
    filters.value.sortOrder = 'desc'
    const amounts = filteredExpenses.value.map((e) => e.amount)
    expect(amounts).toEqual([50, 30, 20, 10])
  })

  it('sorts by amount ascending', () => {
    const { filters, filteredExpenses } = useFilters(ref(sampleExpenses))
    filters.value.sortField = 'amount'
    filters.value.sortOrder = 'asc'
    const amounts = filteredExpenses.value.map((e) => e.amount)
    expect(amounts).toEqual([10, 20, 30, 50])
  })
})
