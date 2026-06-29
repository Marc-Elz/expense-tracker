<template>
  <div>
    <select
      value=""
      @change="addCategory(($event.target as HTMLSelectElement).value as Category); ($event.target as HTMLSelectElement).value = ''"
    >
      <option value="" disabled>+ Categorie toevoegen</option>
      <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
    </select>

    <span v-for="cat in filters.category" :key="cat">
      {{ cat }} <button type="button" @click="removeCategory(cat)">×</button>
    </span>

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
import { computed } from 'vue'
import type { Category, Filters, SortField, SortOrder } from '../types'
import { CATEGORIES } from '../types'

const props = defineProps<{
  filters: Filters
}>()

const emit = defineEmits<{
  'update:filters': [filters: Filters]
}>()

const availableCategories = computed(() =>
  CATEGORIES.filter((cat) => !props.filters.category.includes(cat)),
)

function addCategory(cat: Category) {
  emit('update:filters', { ...props.filters, category: [...props.filters.category, cat] })
}

function removeCategory(cat: Category) {
  emit('update:filters', {
    ...props.filters,
    category: props.filters.category.filter((c) => c !== cat),
  })
}
</script>
