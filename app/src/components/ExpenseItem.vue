<template>
  <li class="table-row" :class="`accent-${expense.category.toLowerCase()}`">
    <span>{{ expense.date }}</span>
    <span>{{ expense.description }}</span>
    <span>{{ expense.category }}</span>
    <span>{{ formatCurrency(expense.amount) }}</span>
    <span class="actions">
      <button type="button" class="btn-link" @click="emit('edit')">Edit</button>
      <button type="button" class="btn-link danger" @click="emit('delete')">Delete</button>
    </span>
  </li>
</template>

<script setup lang="ts">
import type { Expense } from '../types'
import { formatCurrency } from '../utils/formatCurrency'

defineProps<{
  expense: Expense
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()
</script>

<style scoped>
.table-row {
  display: grid;
  grid-template-columns: 110px 1fr 130px 110px 140px;
  gap: var(--spacing-2);
  align-items: center;
  padding: var(--spacing-2) var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  border-left: 6px solid transparent;
}

.table-row:last-child {
  border-bottom: none;
}

.accent-food {
  border-left-color: var(--color-food-text);
}

.accent-transport {
  border-left-color: var(--color-transport-text);
}

.accent-entertainment {
  border-left-color: var(--color-entertainment-text);
}

.accent-other {
  border-left-color: var(--color-other-text);
}

.actions {
  display: flex;
  gap: var(--spacing-2);
}

.btn-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  color: var(--color-primary);
}

.btn-link:hover {
  text-decoration: underline;
}

.btn-link.danger {
  color: var(--color-danger);
}
</style>
