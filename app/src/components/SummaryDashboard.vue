<template>
  <div>
    <p>Totaal: {{ total }}</p>
    <ul>
      <li v-for="cat in CATEGORIES" :key="cat">
        {{ cat }}: {{ categoryTotals[cat] }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '../types'
import { CATEGORIES } from '../types'

defineProps<{
  total: number
  categoryTotals: Record<Category, number>
}>()
</script>
