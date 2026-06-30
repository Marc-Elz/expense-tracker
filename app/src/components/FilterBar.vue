<template>
  <div class="filter-bar">
    <div class="categories">
      <div class="filter-dropdown" ref="dropdownRef">
        <button
          type="button"
          class="filter-toggle"
          aria-label="Categorie toevoegen"
          @click="isOpen = !isOpen"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M3 4h18l-7 8v6l-4 2v-8z" />
          </svg>
        </button>

        <div v-if="isOpen" class="dropdown-menu">
          <button
            v-for="cat in availableCategories"
            :key="cat"
            type="button"
            class="dropdown-option"
            @click="addCategory(cat)"
          >
            {{ cat }}
          </button>
          <span v-if="availableCategories.length === 0" class="dropdown-empty">Alle categorieën geselecteerd</span>
        </div>
      </div>

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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
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

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  // composedPath() is a snapshot of the path at dispatch time, so it still
  // reflects "was the click inside the dropdown" even if that click (e.g.
  // selecting a category) caused the clicked element to be removed from the
  // DOM before this document-level listener runs (event.target.contains()
  // would wrongly say "outside" in that case).
  if (dropdownRef.value && !event.composedPath().includes(dropdownRef.value)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

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

.filter-dropdown {
  position: relative;
}

.filter-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
}

.filter-toggle:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + var(--spacing-1));
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-width: 160px;
  padding: var(--spacing-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-option {
  text-align: left;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 0.9rem;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius);
  color: var(--color-text);
  cursor: pointer;
}

.dropdown-option:hover {
  background: var(--color-bg);
}

.dropdown-empty {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  padding: var(--spacing-1) var(--spacing-2);
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
