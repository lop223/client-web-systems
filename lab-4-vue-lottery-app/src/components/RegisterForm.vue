<script setup lang="ts">
import { watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useParticipantForm } from '@/composables/useParticipantForm'
import type { ParticipantForm } from '@/types/participant'

const props = withDefaults(
  defineProps<{
    isEmailTaken: (email: string, excludeId?: number) => boolean
    initialValues?: ParticipantForm
    excludeId?: number
    title?: string
    subtitle?: string
    submitLabel?: string
    idPrefix?: string
  }>(),
  {
    initialValues: undefined,
    excludeId: undefined,
    title: 'Register form',
    subtitle: 'Please fill in all the fields.',
    submitLabel: 'Save',
    idPrefix: 'register',
  },
)

const emit = defineEmits<{
  submit: [values: ParticipantForm]
}>()

const { form, errors, validateAll, touch, setForm, reset, isValid } = useParticipantForm(
  props.isEmailTaken,
  () => props.excludeId,
)

watch(
  () => props.initialValues,
  (values) => {
    if (values) setForm(values)
  },
  { immediate: true },
)

const today = new Date().toISOString().slice(0, 10)

function onSubmit(): void {
  if (!validateAll()) return
  emit('submit', { ...form })
  if (!props.initialValues) reset()
}
</script>

<template>
  <form class="card card-body mb-3" novalidate @submit.prevent @keyup.enter="onSubmit">
    <h2 class="h6 text-uppercase fw-bold mb-0">{{ title }}</h2>
    <p class="text-muted small">{{ subtitle }}</p>

    <BaseInput
      :id="`${idPrefix}-name`"
      v-model="form.name"
      label="Name"
      placeholder="Enter user name"
      :error="errors.name"
      :valid="isValid('name')"
      @blur="touch('name')"
    />
    <BaseInput
      :id="`${idPrefix}-birth`"
      v-model="form.birthDate"
      label="Date of Birth"
      type="date"
      placeholder="yyyy-mm-dd"
      :max="today"
      :error="errors.birthDate"
      :valid="isValid('birthDate')"
      @blur="touch('birthDate')"
    />
    <BaseInput
      :id="`${idPrefix}-email`"
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="Enter email"
      :error="errors.email"
      :valid="isValid('email')"
      @blur="touch('email')"
    />
    <BaseInput
      :id="`${idPrefix}-phone`"
      v-model="form.phone"
      label="Phone number"
      type="tel"
      placeholder="+380XXXXXXXXX"
      :error="errors.phone"
      :valid="isValid('phone')"
      @blur="touch('phone')"
    />

    <div class="d-flex justify-content-end mt-4">
      <BaseButton type="submit" @click="onSubmit">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>