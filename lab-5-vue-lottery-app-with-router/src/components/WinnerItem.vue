<script setup lang="ts">
defineProps<{
  name: string
}>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <span class="badge bg-info d-inline-flex align-items-center gap-1 me-1">
    {{ name }}
    <button
      type="button"
      class="btn-close btn-close-white"
      style="font-size: 0.55rem"
      :aria-label="`Remove ${name}`"
      @click="emit('remove')"
    ></button>
  </span>
</template>