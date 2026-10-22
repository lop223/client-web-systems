<script setup lang="ts">
import InputText from 'primevue/inputtext'

withDefaults(
  defineProps<{
    id: string
    label: string
    type?: string
    placeholder?: string
    autocomplete?: string
    error?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    autocomplete: undefined,
    error: undefined,
  },
)

const model = defineModel<string | number>({ required: true })
</script>

<template>
  <div class="app-input">
    <label :for="id">{{ label }}</label>
    <InputText
      :id="id"
      :model-value="String(model)"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @update:model-value="model = $event ?? ''"
    />
    <small v-if="error" :id="`${id}-error`" class="app-input__error" role="alert">
      {{ error }}
    </small>
  </div>
</template>

<style scoped>
.app-input {
  display: grid;
  gap: 0.35rem;
}

.app-input__error {
  color: var(--p-red-600);
}
</style>