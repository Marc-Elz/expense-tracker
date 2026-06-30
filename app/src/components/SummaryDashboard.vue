<template>
  <div class="dashboard">
    <p class="total">Totaal: <strong>{{ formatCurrency(total) }}</strong></p>
    <ul class="breakdown">
      <li v-for="cat in CATEGORIES" :key="cat" :class="`accent-${cat.toLowerCase()}`">
        <span class="category">{{ cat }}</span>
        <span>{{ formatCurrency(categoryTotals[cat]) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '../types'
import { CATEGORIES } from '../types'
import { formatCurrency } from '../utils/formatCurrency'

defineProps<{
  total: number
  categoryTotals: Record<Category, number>
}>()
</script>

<style scoped>
.dashboard {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing-3);
}

.total {
  margin: 0 0 var(--spacing-2);
  font-size: 1.125rem;
}

.breakdown {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.breakdown li {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  font-size: 0.9rem;
  padding-left: var(--spacing-2);
  border-left: 3px solid transparent;
}

.category {
  color: var(--color-text-muted);
}

.breakdown li.accent-food {
  border-left-color: var(--color-food-text);
}

.breakdown li.accent-transport {
  border-left-color: var(--color-transport-text);
}

.breakdown li.accent-entertainment {
  border-left-color: var(--color-entertainment-text);
}

.breakdown li.accent-other {
  border-left-color: var(--color-other-text);
}
</style>
