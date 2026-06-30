<template>
  <div>
    <p>Totaal: {{ formatCurrency(total) }}</p>
    <ul>
      <li v-for="cat in CATEGORIES" :key="cat">
        {{ cat }}: {{ formatCurrency(categoryTotals[cat]) }}
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
