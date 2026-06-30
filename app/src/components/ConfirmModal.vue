<template>
  <div v-if="open" class="backdrop" @click.self="emit('cancel')">
    <div class="modal">
      <p>{{ message }}</p>
      <div class="actions">
        <button type="button" class="btn-secondary" @click="emit('cancel')">Cancel</button>
        <button type="button" class="btn-danger" @click="emit('confirm')">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  message: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: var(--spacing-4);
  max-width: 360px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal p {
  margin: 0 0 var(--spacing-3);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing-2) var(--spacing-3);
}

.btn-secondary:hover {
  background: var(--color-bg);
}

.btn-danger {
  background: var(--color-danger);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: var(--spacing-2) var(--spacing-3);
}

.btn-danger:hover {
  opacity: 0.9;
}
</style>
