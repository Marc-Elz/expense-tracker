<template>
  <div>
    <Toast :message="storageError" @dismiss="clearStorageError" />
    <SummaryDashboard :total="total" :category-totals="categoryTotals" />
    <ExpenseForm
      :key="formKey"
      :expense="editingExpense"
      :errors="errors"
      :on-blur="handleBlur"
      :disabled="saveDisabled"
      @submit="handleFormSubmit"
      @cancel="handleCancel"
    />
    <FilterBar :filters="filters" @update:filters="handleFiltersUpdate" />
    <ExpenseList :expenses="filteredExpenses" @edit="handleEdit" @delete="handleDeleteRequest" />
    <ConfirmModal
      :open="pendingDeleteId !== null"
      message="Weet je zeker dat je deze uitgave wilt verwijderen?"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Category, Expense, Filters } from './types'
import { CATEGORIES } from './types'
import { useExpenses } from './composables/useExpenses'
import { useExpenseForm } from './composables/useExpenseForm'
import { useFilters } from './composables/useFilters'
import ExpenseForm from './components/ExpenseForm.vue'
import ExpenseList from './components/ExpenseList.vue'
import FilterBar from './components/FilterBar.vue'
import SummaryDashboard from './components/SummaryDashboard.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import Toast from './components/Toast.vue'

const { expenses, addExpense, updateExpense, deleteExpense, storageError, clearStorageError } =
  useExpenses()
const { form, editingId, errors, isValid, validateField, resetForm, populateForm } = useExpenseForm()
const { filters, filteredExpenses } = useFilters()

const editingExpense = computed(() =>
  editingId.value ? expenses.value.find((e) => e.id === editingId.value) : undefined,
)

const formKey = ref(0)
const pendingDeleteId = ref<string | null>(null)

const total = computed(() => filteredExpenses.value.reduce((sum, e) => sum + e.amount, 0))

const categoryTotals = computed(
  () =>
    Object.fromEntries(
      CATEGORIES.map((cat) => [
        cat,
        filteredExpenses.value
          .filter((e) => e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0),
      ]),
    ) as Record<Category, number>,
)

const isUnchanged = computed(() => {
  if (!editingId.value || !editingExpense.value) return false
  const orig = editingExpense.value
  return (
    form.value.description === orig.description &&
    form.value.amount === orig.amount &&
    form.value.category === orig.category &&
    form.value.date === orig.date
  )
})

const saveDisabled = computed(() => !isValid.value || isUnchanged.value)

function handleBlur(field: 'description' | 'amount' | 'category' | 'date', value: string | number | null) {
  form.value[field] = value as never
  validateField(field)
}

function handleEdit(expense: Expense) {
  populateForm(expense)
}

function handleFormSubmit(data: Omit<Expense, 'id' | 'createdAt'>) {
  if (editingId.value && editingExpense.value) {
    updateExpense({ ...data, id: editingId.value, createdAt: editingExpense.value.createdAt })
  } else {
    addExpense(data)
  }
  resetForm()
  formKey.value++
}

function handleFiltersUpdate(newFilters: Filters) {
  filters.value = newFilters
}

function handleDeleteRequest(id: string) {
  pendingDeleteId.value = id
}

function handleConfirmDelete() {
  if (pendingDeleteId.value) deleteExpense(pendingDeleteId.value)
  pendingDeleteId.value = null
}

function handleCancelDelete() {
  pendingDeleteId.value = null
}

function handleCancel() {
  resetForm()
  formKey.value++
}
</script>
