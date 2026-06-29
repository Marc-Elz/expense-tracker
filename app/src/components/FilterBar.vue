<template>
  <div>
    <select
      :value="filters.category"
      @change="emit('update:filters', { ...filters, category: ($event.target as HTMLSelectElement).value as Category | 'All' })"
    >
      <option value="All">All</option>
      <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
    </select>

    <select
      :value="filters.sortField"
      @change="emit('update:filters', { ...filters, sortField: ($event.target as HTMLSelectElement).value as SortField })"
    >
      <option value="date">Date</option>
      <option value="amount">Amount</option>
    </select>

    <select
      :value="filters.sortOrder"
      @change="emit('update:filters', { ...filters, sortOrder: ($event.target as HTMLSelectElement).value as SortOrder })"
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Category, Filters, SortField, SortOrder } from '../types'
import { CATEGORIES } from '../types'

defineProps<{
  filters: Filters
}>()

const emit = defineEmits<{
  'update:filters': [filters: Filters]
}>()
</script>
