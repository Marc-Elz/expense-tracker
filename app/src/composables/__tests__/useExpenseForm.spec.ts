import { describe, expect, it } from 'vitest'
import { useExpenseForm } from '../useExpenseForm'
import type { Category, Expense } from '../../types'

function toLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

describe('useExpenseForm', () => {
  describe('validateField — description', () => {
    it('leeg geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.description = ''
      validateField('description')
      expect(errors.value.description).toBe('Omschrijving is verplicht.')
    })

    it('meer dan 100 tekens geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.description = 'a'.repeat(101)
      validateField('description')
      expect(errors.value.description).toBe('Maximaal 100 tekens.')
    })

    it('geldige waarde geeft geen error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.description = 'Lunch'
      validateField('description')
      expect(errors.value.description).toBe('')
    })
  })

  describe('validateField — amount', () => {
    it('null geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.amount = null
      validateField('amount')
      expect(errors.value.amount).toBe('Bedrag is verplicht.')
    })

    it('0 geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.amount = 0
      validateField('amount')
      expect(errors.value.amount).toBe('Bedrag moet groter dan 0 zijn.')
    })

    it('negatief getal geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.amount = -5
      validateField('amount')
      expect(errors.value.amount).toBe('Bedrag moet groter dan 0 zijn.')
    })

    it('boven het maximum geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.amount = 1000000
      validateField('amount')
      expect(errors.value.amount).toBe('Bedrag mag maximaal € 999.999,99 zijn.')
    })

    it('geldige waarde geeft geen error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.amount = 12.5
      validateField('amount')
      expect(errors.value.amount).toBe('')
    })
  })

  describe('validateField — category', () => {
    it('ongeldige waarde geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.category = 'Invalid' as Category
      validateField('category')
      expect(errors.value.category).toBe('Selecteer een geldige categorie.')
    })

    it('geldige waarde geeft geen error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.category = 'Transport'
      validateField('category')
      expect(errors.value.category).toBe('')
    })
  })

  describe('validateField — date', () => {
    it('leeg geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.date = ''
      validateField('date')
      expect(errors.value.date).toBe('Datum is verplicht.')
    })

    it('verkeerd formaat geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.date = '10-01-2024'
      validateField('date')
      expect(errors.value.date).toBe('Voer een geldige datum in (JJJJ-MM-DD).')
    })

    it('toekomstige datum geeft een error', () => {
      const { form, errors, validateField } = useExpenseForm()
      const future = new Date()
      future.setDate(future.getDate() + 1)
      form.value.date = toLocalDateString(future)
      validateField('date')
      expect(errors.value.date).toBe('Datum mag niet in de toekomst liggen.')
    })

    it('vandaag geeft geen error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.date = toLocalDateString(new Date())
      validateField('date')
      expect(errors.value.date).toBe('')
    })

    it('verleden datum geeft geen error', () => {
      const { form, errors, validateField } = useExpenseForm()
      form.value.date = '2024-01-10'
      validateField('date')
      expect(errors.value.date).toBe('')
    })
  })

  describe('isValid / validateAll', () => {
    it('is false bij een leeg form', () => {
      const { isValid } = useExpenseForm()
      expect(isValid.value).toBe(false)
    })

    it('is true wanneer alle velden geldig ingevuld zijn', () => {
      const { form, validateAll, isValid } = useExpenseForm()
      form.value.description = 'Lunch'
      form.value.amount = 12.5
      form.value.category = 'Food'
      form.value.date = '2024-01-10'
      validateAll()
      expect(isValid.value).toBe(true)
    })

    it('is false zodra één veld ongeldig is', () => {
      const { form, validateAll, isValid } = useExpenseForm()
      form.value.description = 'Lunch'
      form.value.amount = -1
      form.value.category = 'Food'
      form.value.date = '2024-01-10'
      validateAll()
      expect(isValid.value).toBe(false)
    })

    it('validateAll retourneert false als er errors zijn', () => {
      const { form, validateAll } = useExpenseForm()
      form.value.description = ''
      expect(validateAll()).toBe(false)
    })

    it('validateAll retourneert true als alles geldig is', () => {
      const { form, validateAll } = useExpenseForm()
      form.value.description = 'Lunch'
      form.value.amount = 12.5
      form.value.category = 'Food'
      form.value.date = '2024-01-10'
      expect(validateAll()).toBe(true)
    })
  })

  describe('resetForm', () => {
    it('reset form naar defaults', () => {
      const { form, resetForm } = useExpenseForm()
      form.value.description = 'Lunch'
      form.value.amount = 12.5
      form.value.category = 'Transport'
      form.value.date = '2024-01-10'
      resetForm()
      expect(form.value).toEqual({
        description: '',
        amount: null,
        category: 'Food',
        date: '',
      })
    })

    it('reset editingId naar null', () => {
      const { editingId, resetForm } = useExpenseForm()
      editingId.value = 'some-id'
      resetForm()
      expect(editingId.value).toBeNull()
    })

    it('reset errors naar leeg', () => {
      const { form, errors, validateField, resetForm } = useExpenseForm()
      form.value.description = ''
      validateField('description')
      expect(errors.value.description).not.toBe('')
      resetForm()
      expect(errors.value).toEqual({
        description: '',
        amount: '',
        category: '',
        date: '',
      })
    })

    it('zet category op "Food" zonder argument (0 actieve filters)', () => {
      const { form, resetForm } = useExpenseForm()
      form.value.category = 'Transport'
      resetForm()
      expect(form.value.category).toBe('Food')
    })

    it('zet category op de meegegeven default (1 actieve filter)', () => {
      const { form, resetForm } = useExpenseForm()
      form.value.category = 'Food'
      resetForm('Transport')
      expect(form.value.category).toBe('Transport')
    })

    it('zet category op "Food" wanneer geen eenduidige default geldt (2+ actieve filters)', () => {
      const { form, resetForm } = useExpenseForm()
      form.value.category = 'Entertainment'
      resetForm('Food')
      expect(form.value.category).toBe('Food')
    })
  })

  describe('populateForm', () => {
    const expense: Expense = {
      id: 'abc-123',
      description: 'Diner',
      amount: 50,
      category: 'Entertainment',
      date: '2024-01-15',
      createdAt: 1700000000000,
    }

    it('vult form met expense-data', () => {
      const { form, populateForm } = useExpenseForm()
      populateForm(expense)
      expect(form.value).toEqual({
        description: 'Diner',
        amount: 50,
        category: 'Entertainment',
        date: '2024-01-15',
      })
    })

    it('zet editingId op expense.id', () => {
      const { editingId, populateForm } = useExpenseForm()
      populateForm(expense)
      expect(editingId.value).toBe('abc-123')
    })

    it('reset errors naar leeg', () => {
      const { form, errors, validateField, populateForm } = useExpenseForm()
      form.value.description = ''
      validateField('description')
      expect(errors.value.description).not.toBe('')
      populateForm(expense)
      expect(errors.value).toEqual({
        description: '',
        amount: '',
        category: '',
        date: '',
      })
    })
  })
})
