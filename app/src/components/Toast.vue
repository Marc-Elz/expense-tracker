<template>
  <div v-if="message" role="alert">
    <span>{{ message }}</span>
    <button type="button" @click="emit('dismiss')">×</button>
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
