export const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const PHONE_REGEXP = /^\+380\d{9}$/

export function validateRequired(value: string): string {
  return value.trim() ? '' : 'This value is required.'
}

export function validateName(value: string): string {
  return validateRequired(value)
}

export function validateBirthDate(value: string): string {
  const required = validateRequired(value)
  if (required) return required

  const today = new Date().toISOString().slice(0, 10)
  return value > today ? 'Date of birth cannot be in the future.' : ''
}

export function validateEmail(value: string): string {
  const required = validateRequired(value)
  if (required) return required
  return EMAIL_REGEXP.test(value.trim()) ? '' : 'Enter a valid email address.'
}

export function validatePhone(value: string): string {
  const required = validateRequired(value)
  if (required) return required
  return PHONE_REGEXP.test(value.trim()) ? '' : 'Phone must be in format +380XXXXXXXXX.'
}