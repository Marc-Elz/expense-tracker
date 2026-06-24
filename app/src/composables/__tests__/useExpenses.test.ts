import { nextTick } from 'vue'
import { useExpenses } from '../useExpenses'
import type { Expense } from '../../types'

function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 'test-id',
    description: 'Test expense',
    amount: 10.5,
    category: 'Food',
    date: '2024-01-15',
    createdAt: 1705276800000,
    ...overrides,
  }
}

describe('useExpenses', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('starts with empty array when localStorage is empty', () => {
    const { expenses } = useExpenses()
    expect(expenses.value).toEqual([])
  })

  it('addExpense appends expense to array', () => {
    const { expenses, addExpense } = useExpenses()
    addExpense(makeExpense())
    expect(expenses.value).toHaveLength(1)
    expect(expenses.value[0].description).toBe('Test expense')
  })

  it('updateExpense replaces the matching expense', () => {
    const { expenses, addExpense, updateExpense } = useExpenses()
    addExpense(makeExpense({ id: 'abc', description: 'Original' }))
    updateExpense(makeExpense({ id: 'abc', description: 'Updated' }))
    expect(expenses.value[0].description).toBe('Updated')
  })

  it('updateExpense does nothing for unknown id', () => {
    const { expenses, addExpense, updateExpense } = useExpenses()
    addExpense(makeExpense({ id: 'abc' }))
    updateExpense(makeExpense({ id: 'xyz', description: 'Ghost' }))
    expect(expenses.value[0].description).toBe('Test expense')
  })

  it('deleteExpense removes expense with matching id', () => {
    const { expenses, addExpense, deleteExpense } = useExpenses()
    addExpense(makeExpense({ id: 'keep' }))
    addExpense(makeExpense({ id: 'remove' }))
    deleteExpense('remove')
    expect(expenses.value).toHaveLength(1)
    expect(expenses.value[0].id).toBe('keep')
  })

  it('persists data to localStorage after mutation', async () => {
    const { addExpense } = useExpenses()
    addExpense(makeExpense({ id: 'persisted' }))
    await nextTick()
    const stored = JSON.parse(localStorage.getItem('expenses') ?? '[]') as Expense[]
    expect(stored[0].id).toBe('persisted')
  })

  it('loads existing expenses from localStorage on init', () => {
    localStorage.setItem('expenses', JSON.stringify([makeExpense({ id: 'loaded' })]))
    const { expenses } = useExpenses()
    expect(expenses.value[0].id).toBe('loaded')
  })

  it('falls back to empty array on corrupt localStorage data', () => {
    localStorage.setItem('expenses', 'not{{valid}}json')
    const { expenses } = useExpenses()
    expect(expenses.value).toEqual([])
  })

  it('does not crash on QuotaExceededError and keeps in-memory state', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError')
    })
    const { expenses, addExpense } = useExpenses()
    addExpense(makeExpense())
    await nextTick()
    expect(expenses.value).toHaveLength(1)
  })
})
