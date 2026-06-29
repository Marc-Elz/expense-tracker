export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Other'

export const CATEGORIES: readonly Category[] = ['Food', 'Transport', 'Entertainment', 'Other']

export type SortField = 'date' | 'amount'

export type SortOrder = 'asc' | 'desc'

export interface Filters {
  category: Category | 'All'
  sortField: SortField
  sortOrder: SortOrder
}

export interface Expense {
  id: string
  description: string
  amount: number
  category: Category
  date: string
  createdAt: number
}
