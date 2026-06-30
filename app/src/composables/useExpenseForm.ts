import { computed, ref } from 'vue'
import type { Category, Expense } from '../types'

interface ExpenseFormState {
  description: string
  amount: number | null
  category: Category
  date: string
}

export type FormField = keyof ExpenseFormState
export type FormErrors = Record<FormField, string>
export type OnBlurFn = (field: FormField, value: string | number | null) => void

const VALID_CATEGORIES: Category[] = ['Food', 'Transport', 'Entertainment', 'Other']

const defaultForm = (category: Category = 'Food'): ExpenseFormState => ({
  description: '',
  amount: null,
  category,
  date: '',
})

const defaultErrors = (): FormErrors => ({
  description: '',
  amount: '',
  category: '',
  date: '',
})

export function useExpenseForm() {
  const form = ref<ExpenseFormState>(defaultForm())
  const editingId = ref<string | null>(null)
  const errors = ref<FormErrors>(defaultErrors())

  function validateField(field: keyof ExpenseFormState): void {
    switch (field) {
      case 'description': {
        const val = form.value.description.trim()
        if (!val) errors.value.description = 'Omschrijving is verplicht.'
        else if (val.length > 100) errors.value.description = 'Maximaal 100 tekens.'
        else errors.value.description = ''
        break
      }
      case 'amount': {
        const val = form.value.amount
        if (val === null || val === undefined || String(val) === '')
          errors.value.amount = 'Bedrag is verplicht.'
        else if (isNaN(Number(val)) || Number(val) <= 0)
          errors.value.amount = 'Bedrag moet groter dan 0 zijn.'
        else if (Number(val) > 999999.99)
          errors.value.amount = 'Bedrag mag maximaal € 999.999,99 zijn.'
        else errors.value.amount = ''
        break
      }
      case 'category': {
        if (!VALID_CATEGORIES.includes(form.value.category))
          errors.value.category = 'Selecteer een geldige categorie.'
        else errors.value.category = ''
        break
      }
      case 'date': {
        const val = form.value.date
        if (!val) {
          errors.value.date = 'Datum is verplicht.'
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          errors.value.date = 'Voer een geldige datum in (JJJJ-MM-DD).'
        } else {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const entered = new Date(`${val}T00:00:00`)
          if (isNaN(entered.getTime())) errors.value.date = 'Voer een geldige datum in.'
          else if (entered > today) errors.value.date = 'Datum mag niet in de toekomst liggen.'
          else errors.value.date = ''
        }
        break
      }
    }
  }

  function validateAll(): boolean {
    ;(Object.keys(form.value) as (keyof ExpenseFormState)[]).forEach(validateField)
    return Object.values(errors.value).every((e) => e === '')
  }

  const isValid = computed(
    () =>
      Object.values(errors.value).every((e) => e === '') &&
      form.value.description.trim() !== '' &&
      form.value.amount !== null &&
      form.value.date !== '',
  )

  function resetForm(defaultCategory: Category = 'Food') {
    form.value = defaultForm(defaultCategory)
    editingId.value = null
    errors.value = defaultErrors()
  }

  function populateForm(expense: Expense) {
    form.value = {
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    }
    editingId.value = expense.id
    errors.value = defaultErrors()
  }

  return { form, editingId, errors, isValid, validateField, validateAll, resetForm, populateForm }
}
