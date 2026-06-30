<template>
  <div class="expense-list">
    <p v-if="expenses.length === 0 && !hasAnyExpenses" class="empty-state">
      Nog geen uitgaven. Voeg je eerste uitgave toe!
    </p>
    <p v-else-if="expenses.length === 0" class="empty-state">
      Geen uitgaven gevonden voor deze filter.
    </p>

    <ul v-else class="table">
      <li class="table-row table-header">
        <span>Datum</span>
        <span>Omschrijving</span>
        <span>Categorie</span>
        <span>Bedrag</span>
        <span></span>
      </li>
      <ExpenseItem
        v-for="expense in expenses"
        :key="expense.id"
        :expense="expense"
        @edit="emit('edit', expense)"
        @delete="emit('delete', expense.id)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Expense } from '../types'
import ExpenseItem from './ExpenseItem.vue'

defineProps<{
  expenses: readonly Expense[]
  hasAnyExpenses: boolean
}>()

const emit = defineEmits<{
  edit: [expense: Expense]
  delete: [id: string]
}>()
</script>

<style scoped>
.expense-list {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.empty-state {
  margin: 0;
  padding: var(--spacing-3);
  color: var(--color-text-muted);
  text-align: center;
}

.table {
  list-style: none;
  margin: 0;
  padding: 0;
}

.table-row {
  display: grid;
  grid-template-columns: 110px 1fr 130px 110px 140px;
  gap: var(--spacing-2);
  align-items: center;
  padding: var(--spacing-2) var(--spacing-3);
}

.table-header {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}
</style>
