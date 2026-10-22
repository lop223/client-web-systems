<script setup lang="ts">
import Button from 'primevue/button'

withDefaults(
  defineProps<{
    label?: string
    type?: 'button' | 'submit' | 'reset'
    severity?:
      'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    severity: 'primary',
    disabled: false,
    loading: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Button
    :label="label"
    :type="type"
    :severity="severity"
    :disabled="disabled"
    :loading="loading"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>
