import { reactive, ref } from 'vue'
import type { FormErrors, ParticipantForm } from '@/types/participant'
import {
  validateBirthDate,
  validateEmail,
  validateName,
  validatePhone,
} from '@/utils/validators'

const emptyForm = (): ParticipantForm => ({
  name: '',
  birthDate: '',
  email: '',
  phone: '',
})

export function useParticipantForm(
  isEmailTaken: (email: string, excludeId?: number) => boolean,
  excludeId?: () => number | undefined,
) {
  const form = reactive<ParticipantForm>(emptyForm())
  const errors = reactive<FormErrors>({})
  const touched = reactive<Partial<Record<keyof ParticipantForm, boolean>>>({})
  const isSubmitted = ref(false)

  function validateField(field: keyof ParticipantForm): string {
    switch (field) {
      case 'name':
        return validateName(form.name)
      case 'birthDate':
        return validateBirthDate(form.birthDate)
      case 'email': {
        const error = validateEmail(form.email)
        if (error) return error
        return isEmailTaken(form.email, excludeId?.())
          ? 'Participant with this email already exists.'
          : ''
      }
      case 'phone':
        return validatePhone(form.phone)
    }
  }

  function touch(field: keyof ParticipantForm): void {
    touched[field] = true
    errors[field] = validateField(field)
  }

  function validateAll(): boolean {
    const fields = Object.keys(form) as (keyof ParticipantForm)[]
    fields.forEach(touch)
    return fields.every((field) => !errors[field])
  }

  function setForm(values: ParticipantForm): void {
    Object.assign(form, values)
  }

  function reset(): void {
    Object.assign(form, emptyForm())
    ;(Object.keys(errors) as (keyof ParticipantForm)[]).forEach((key) => delete errors[key])
    ;(Object.keys(touched) as (keyof ParticipantForm)[]).forEach((key) => delete touched[key])
    isSubmitted.value = false
  }

  function isValid(field: keyof ParticipantForm): boolean {
    return Boolean(touched[field]) && !errors[field]
  }

  return { form, errors, touched, validateAll, touch, setForm, reset, isValid }
}