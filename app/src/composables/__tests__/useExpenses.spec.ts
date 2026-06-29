import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const STORAGE_KEY = 'expenses'

const sampleData = {
  description: 'Lunch',
  amount: 12.5,
  category: 'Food' as const,
  date: '2024-01-15',
}

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

describe('useExpenses', () => {
  beforeEach(() => {
    localStorageMock.clear()
    localStorageMock.setItem.mockClear()
    vi.resetModules()
  })

  async function getComposable() {
    const { useExpenses } = await import('../useExpenses')
    return useExpenses()
  }

  it('addExpense voegt expense toe met gegenereerd id en createdAt', async () => {
    const { expenses, addExpense } = await getComposable()
    addExpense(sampleData)
    expect(expenses.value).toHaveLength(1)
    expect(expenses.value[0]).toMatchObject(sampleData)
    expect(expenses.value[0].id).toBeTruthy()
    expect(expenses.value[0].createdAt).toBeTypeOf('number')
  })

  it('updateExpense vervangt expense met zelfde id', async () => {
    const { expenses, addExpense, updateExpense } = await getComposable()
    addExpense(sampleData)
    const expense = expenses.value[0]
    updateExpense({ ...expense, description: 'Diner' })
    expect(expenses.value).toHaveLength(1)
    expect(expenses.value[0].description).toBe('Diner')
  })

  it('deleteExpense verwijdert expense op id', async () => {
    const { expenses, addExpense, deleteExpense } = await getComposable()
    addExpense(sampleData)
    const id = expenses.value[0].id
    deleteExpense(id)
    expect(expenses.value).toHaveLength(0)
  })

  it('persisteert expenses naar localStorage na mutatie', async () => {
    const { addExpense } = await getComposable()
    addExpense(sampleData)
    await nextTick()
    const stored = JSON.parse(store[STORAGE_KEY])
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject(sampleData)
  })

  it('herstelt expenses uit localStorage bij herinitialisatie', async () => {
    const { addExpense } = await getComposable()
    addExpense(sampleData)
    await nextTick()

    vi.resetModules()

    const { expenses } = await getComposable()
    expect(expenses.value).toHaveLength(1)
    expect(expenses.value[0]).toMatchObject(sampleData)
  })

  it('valt terug op lege array bij corrupt localStorage data', async () => {
    store[STORAGE_KEY] = 'dit is geen json{{{'
    const { expenses } = await getComposable()
    expect(expenses.value).toEqual([])
  })

  it('gooit geen crash bij QuotaExceededError', async () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    const { addExpense } = await getComposable()
    addExpense(sampleData)
    await nextTick()
    // test bereikt deze regel = geen crash
  })
})
