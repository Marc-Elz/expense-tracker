<template>
  <div class="filter-bar">
    <div class="categories">
      <select
        class="add-category"
        value=""
        @change="addCategory(($event.target as HTMLSelectElement).value as Category); ($event.target as HTMLSelectElement).value = ''"
      >
        <option value="" disabled>+ Categorie toevoegen</option>
        <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <span v-for="cat in filters.category" :key="cat" class="chip" :class="`chip-${cat.toLowerCase()}`">
        {{ cat }} <button type="button" class="chip-remove" @click="removeCategory(cat)">×</button>
      </span>
    </div>

    <div class="sort">
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

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-2);
}

.categories {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-1);
}

.sort {
  display: flex;
  gap: var(--spacing-1);
}

select {
  font-family: inherit;
  font-size: 0.9rem;
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: 0.85rem;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-pill);
  background: var(--color-primary-bg);
  color: var(--color-primary);
  transition: background-color 0.15s ease;
}

.chip-food {
  background: var(--color-food-bg);
  color: var(--color-food-text);
}

.chip-transport {
  background: var(--color-transport-bg);
  color: var(--color-transport-text);
}

.chip-entertainment {
  background: var(--color-entertainment-bg);
  color: var(--color-entertainment-text);
}

.chip-other {
  background: var(--color-other-bg);
  color: var(--color-other-text);
}

.chip:has(.chip-remove:hover) {
  background: var(--color-primary-bg-hover);
}

.chip-food:has(.chip-remove:hover) {
  background: var(--color-food-bg-hover);
}

.chip-transport:has(.chip-remove:hover) {
  background: var(--color-transport-bg-hover);
}

.chip-entertainment:has(.chip-remove:hover) {
  background: var(--color-entertainment-bg-hover);
}

.chip-other:has(.chip-remove:hover) {
  background: var(--color-other-bg-hover);
}

.chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  border-radius: 50%;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1;
  color: inherit;
}
</style>
