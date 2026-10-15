<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const emit = defineEmits<{
  'filter-by-name': [name: string]
}>()

const query = ref('')
let timerId: ReturnType<typeof setTimeout> | undefined

watch(query, (value) => {
  clearTimeout(timerId)
  timerId = setTimeout(() => emit('filter-by-name', value.trim()), 300)
})

onBeforeUnmount(() => clearTimeout(timerId))
</script>

<template>
  <div class="mb-3">
    <input
      v-model="query"
      type="search"
      class="form-control"
      placeholder="Search by name"
      aria-label="Search by name"
    />
  </div>
</template>