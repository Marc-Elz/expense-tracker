import { beforeEach, describe, expect, it, vi } from 'vitest'

const store: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string): string | null => store[key] ?? null,
  setItem: vi.fn((key: string, value: string): void => {
    store[key] = value
  }),
  removeItem: (key: string): void => {
    delete store[key]
  },
  clear: (): void => {
    Object.keys(store).forEach((k) => delete store[k])
  },
}
vi.stubGlobal('localStorage', localStorageMock)

describe('useFilters', () => {
  beforeEach(() => {
    localStorageMock.clear()
    localStorageMock.setItem.mockClear()
    vi.resetModules()
  })

  async function getComposables() {
    const { useExpenses } = await import('../useExpenses')
    const { useFilters } = await import('../useFilters')
    return { ...useExpenses(), ...useFilters() }
  }

  const food = { description: 'Lunch', amount: 12.5, category: 'Food' as const, date: '2024-01-10' }
  const transport = { description: 'Bus', amount: 3.0, category: 'Transport' as const, date: '2024-01-20' }
  const expensiveFood = { description: 'Diner', amount: 50.0, category: 'Food' as const, date: '2024-01-15' }

  it('filter All toont alle expenses', async () => {
    const { addExpense, filteredExpenses, filters } = await getComposables()
    addExpense(food)
    addExpense(transport)
    filters.value.category = 'All'
    expect(filteredExpenses.value).toHaveLength(2)
  })

  it('filter Food toont alleen Food-expenses', async () => {
    const { addExpense, filteredExpenses, filters } = await getComposables()
    addExpense(food)
    addExpense(transport)
    filters.value.category = 'Food'
    expect(filteredExpenses.value).toHaveLength(1)
    expect(filteredExpenses.value[0].category).toBe('Food')
  })

  it('filter Transport toont alleen Transport-expenses', async () => {
    const { addExpense, filteredExpenses, filters } = await getComposables()
    addExpense(food)
    addExpense(transport)
    filters.value.category = 'Transport'
    expect(filteredExpenses.value).toHaveLength(1)
    expect(filteredExpenses.value[0].category).toBe('Transport')
  })

  it('sort datum asc geeft oudste eerst', async () => {
    const { addExpense, filteredExpenses, filters } = await getComposables()
    addExpense(food)
    addExpense(transport)
    filters.value.sortField = 'date'
    filters.value.sortOrder = 'asc'
    expect(filteredExpenses.value[0].date).toBe('2024-01-10')
    expect(filteredExpenses.value[1].date).toBe('2024-01-20')
  })

  it('sort datum desc geeft nieuwste eerst', async () => {
    const { addExpense, filteredExpenses, filters } = await getComposables()
    addExpense(food)
    addExpense(transport)
    filters.value.sortField = 'date'
    filters.value.sortOrder = 'desc'
    expect(filteredExpenses.value[0].date).toBe('2024-01-20')
    expect(filteredExpenses.value[1].date).toBe('2024-01-10')
  })

  it('sort bedrag asc geeft laagste eerst', async () => {
    const { addExpense, filteredExpenses, filters } = await getComposables()
    addExpense(food)
    addExpense(expensiveFood)
    filters.value.sortField = 'amount'
    filters.value.sortOrder = 'asc'
    expect(filteredExpenses.value[0].amount).toBe(12.5)
    expect(filteredExpenses.value[1].amount).toBe(50.0)
  })

  it('sort bedrag desc geeft hoogste eerst', async () => {
    const { addExpense, filteredExpenses, filters } = await getComposables()
    addExpense(food)
    addExpense(expensiveFood)
    filters.value.sortField = 'amount'
    filters.value.sortOrder = 'desc'
    expect(filteredExpenses.value[0].amount).toBe(50.0)
    expect(filteredExpenses.value[1].amount).toBe(12.5)
  })
})
