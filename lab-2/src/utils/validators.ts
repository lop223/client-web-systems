/**
 * Простір імен Validation об'єднує всю логіку перевірки введених даних
 * (обов'язкові поля, рік видання, ID користувача, email) в одному місці.
 */
export namespace Validation {
  export interface ValidationResult {
    valid: boolean;
    message?: string;
  }

  export function required(value: string, fieldName = 'Поле'): ValidationResult {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: `${fieldName} є обов'язковим` };
    }
    return { valid: true };
  }

  /** Перевіряє, що рік видання — це чотиризначне число, не більше за поточний рік. */
  export function isYear(value: string): ValidationResult {
    const requiredCheck = required(value, 'Рік видання');
    if (!requiredCheck.valid) return requiredCheck;

    const yearRegex = /^(1[0-9]{3}|20[0-9]{2})$/;
    if (!yearRegex.test(value.trim())) {
      return { valid: false, message: 'Рік видання має бути коректним чотиризначним роком' };
    }

    const year = Number(value);
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
      return { valid: false, message: `Рік видання не може перевищувати ${currentYear}` };
    }

    return { valid: true };
  }

  /** ID користувача — лише цифри. */
  export function isUserId(value: string): ValidationResult {
    const requiredCheck = required(value, 'ID користувача');
    if (!requiredCheck.valid) return requiredCheck;

    const idRegex = /^[0-9]+$/;
    if (!idRegex.test(value.trim())) {
      return { valid: false, message: 'ID користувача повинен містити лише цифри' };
    }

    return { valid: true };
  }

  export function isEmail(value: string): ValidationResult {
    const requiredCheck = required(value, 'Email');
    if (!requiredCheck.valid) return requiredCheck;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return { valid: false, message: 'Введіть коректний email' };
    }

    return { valid: true };
  }
}
