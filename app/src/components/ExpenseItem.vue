<template>
  <li>
    <span>{{ expense.date }}</span>
    <span>{{ expense.description }}</span>
    <span>{{ expense.category }}</span>
    <span>{{ formatCurrency(expense.amount) }}</span>
    <button type="button" @click="emit('edit')">Edit</button>
    <button type="button" @click="emit('delete')">Delete</button>
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
