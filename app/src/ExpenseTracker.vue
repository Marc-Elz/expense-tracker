<template>
  <div>
    <SummaryDashboard :total="total" :category-totals="categoryTotals" />
    <ExpenseForm
      :key="formKey"
      :expense="editingExpense"
      @submit="handleFormSubmit"
      @cancel="handleCancel"
    />
    <ExpenseList :expenses="expenses" @edit="handleEdit" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Category, Expense } from './types'
import { CATEGORIES } from './types'
import { useExpenses } from './composables/useExpenses'
import { useExpenseForm } from './composables/useExpenseForm'
import ExpenseForm from './components/ExpenseForm.vue'
import ExpenseList from './components/ExpenseList.vue'
import SummaryDashboard from './components/SummaryDashboard.vue'

const { expenses, addExpense, updateExpense } = useExpenses()
const { editingId, resetForm, populateForm } = useExpenseForm()

const editingExpense = computed(() =>
  editingId.value ? expenses.value.find((e) => e.id === editingId.value) : undefined,
)

const formKey = ref(0)

const total = computed(() => expenses.value.reduce((sum, e) => sum + e.amount, 0))

const categoryTotals = computed(
  () =>
    Object.fromEntries(
      CATEGORIES.map((cat) => [
        cat,
        expenses.value
          .filter((e) => e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0),
      ]),
    ) as Record<Category, number>,
)

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

function handleCancel() {
  resetForm()
  formKey.value++
}
</script>
