<template>
  <div>
    <p v-if="expenses.length === 0">Geen uitgaven gevonden. Voeg je eerste uitgave toe!</p>

    <ul v-else>
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
}>()

const emit = defineEmits<{
  edit: [expense: Expense]
  delete: [id: string]
}>()
</script>
