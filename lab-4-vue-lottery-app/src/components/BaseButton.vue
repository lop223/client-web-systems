<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'info' | 'primary' | 'danger' | 'secondary' | 'outline-secondary'
    size?: 'sm' | 'md'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'info',
    size: 'md',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn"
    :class="[`btn-${variant}`, { 'btn-sm': size === 'sm' }]"
  >
    <slot />
  </button>
</template>