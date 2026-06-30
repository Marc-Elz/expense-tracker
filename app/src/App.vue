<template>
  <ExpenseTracker />
</template>

<script setup lang="ts">
import ExpenseTracker from './ExpenseTracker.vue'
</script>

<style>
:root {
  --color-bg: #f5f5f5;
  --color-surface: #ffffff;
  --color-border: #ddd;
  --color-text: #1a1a1a;
  --color-text-muted: #666;
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-bg: #dbeafe;
  --color-primary-bg-hover: #bfdbfe;
  --color-danger: #dc2626;
  --color-danger-bg: #fee2e2;

  --color-food-bg: #dcfce7;
  --color-food-bg-hover: #bbf7d0;
  --color-food-text: #166534;
  --color-transport-bg: #dbeafe;
  --color-transport-bg-hover: #bfdbfe;
  --color-transport-text: #1e40af;
  --color-entertainment-bg: #fae8ff;
  --color-entertainment-bg-hover: #f5d0fe;
  --color-entertainment-text: #86198f;
  --color-other-bg: #ffedd5;
  --color-other-bg-hover: #fed7aa;
  --color-other-text: #9a3412;

  --radius: 6px;
  --radius-pill: 9999px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 16px;
  --spacing-4: 24px;
  --font-sans:
    system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
}

button {
  font-family: inherit;
  cursor: pointer;
}
</style>
