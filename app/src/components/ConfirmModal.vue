<template>
  <Modal :open="open" @cancel="emit('cancel')">
    <p>{{ message }}</p>
    <div class="actions">
      <button type="button" class="btn-secondary" @click="emit('cancel')">Cancel</button>
      <button type="button" class="btn-danger" @click="emit('confirm')">Confirm</button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'

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
p {
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
