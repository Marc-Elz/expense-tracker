<template>
  <div v-if="open">
    <p>{{ message }}</p>
    <button type="button" @click="emit('cancel')">Cancel</button>
    <button type="button" @click="emit('confirm')">Confirm</button>
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
