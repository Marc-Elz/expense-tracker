<template>
  <div v-if="message" role="alert" class="toast">
    <span>{{ message }}</span>
    <button type="button" class="dismiss" @click="emit('dismiss')">×</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string | null
}>()

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<style scoped>
.toast {
  position: fixed;
  top: var(--spacing-3);
  right: var(--spacing-3);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background: var(--color-danger-bg);
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius);
  padding: var(--spacing-2) var(--spacing-3);
  z-index: 200;
}

.dismiss {
  background: none;
  border: none;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}
</style>
