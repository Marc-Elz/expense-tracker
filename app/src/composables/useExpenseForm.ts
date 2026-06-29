import { ref } from 'vue'
import type { Category, Expense } from '../types'

interface ExpenseFormState {
  description: string
  amount: number | null
  category: Category
  date: string
}

const defaultForm = (): ExpenseFormState => ({
  description: '',
  amount: null,
  category: 'Food',
  date: '',
})

export function useExpenseForm() {
  const form = ref<ExpenseFormState>(defaultForm())
  const editingId = ref<string | null>(null)

  function resetForm() {
    form.value = defaultForm()
    editingId.value = null
  }

  function populateForm(expense: Expense) {
    form.value = {
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    }
    editingId.value = expense.id
  }

  return { form, editingId, resetForm, populateForm }
}
