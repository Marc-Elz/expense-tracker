<template>
  <div>
    <select multiple @change="handleCategoryChange">
      <option
        v-for="cat in CATEGORIES"
        :key="cat"
        :value="cat"
        :selected="filters.category.includes(cat)"
      >{{ cat }}</option>
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

const props = defineProps<{
  filters: Filters
}>()

const emit = defineEmits<{
  'update:filters': [filters: Filters]
}>()

function handleCategoryChange(event: Event) {
  const selected = Array.from(
    (event.target as HTMLSelectElement).selectedOptions,
  ).map((o) => o.value as Category)
  emit('update:filters', { ...props.filters, category: selected })
}
</script>
