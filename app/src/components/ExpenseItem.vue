<template>
  <li>
    <span>{{ expense.date }}</span>
    <span>{{ expense.description }}</span>
    <span>{{ expense.category }}</span>
    <span>{{ expense.amount }}</span>
    <button type="button" @click="emit('edit')">Edit</button>
    <button type="button" @click="emit('delete')">Delete</button>
  </li>
</template>

<script setup lang="ts">
import type { Expense } from '../types'

defineProps<{
  expense: Expense
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()
</script>
