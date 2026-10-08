<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    type?: string
    placeholder?: string
    error?: string
    valid?: boolean
    max?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    error: '',
    valid: false,
    max: undefined,
  },
)

const model = defineModel<string>({ required: true })

const emit = defineEmits<{
  blur: []
}>()

const inputClass = computed(() => ({
  'is-invalid': Boolean(props.error),
  'is-valid': props.valid && !props.error,
}))
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :max="max"
      class="form-control"
      :class="inputClass"
      @blur="emit('blur')"
    />
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>