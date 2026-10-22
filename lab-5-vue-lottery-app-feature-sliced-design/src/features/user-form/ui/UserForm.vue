<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import type { CreateUserDto } from '@/entities/user'
import { AppButton, AppInput } from '@/shared/ui'

type UserFormValues = {
  firstName: string
  lastName: string
  email: string
  username: string
  password?: string
  age: string
  gender: string
  phone: string
}

const props = defineProps<{
  mode: 'create' | 'edit'
  initialValues?: Partial<CreateUserDto>
}>()

const emit = defineEmits<{
  submit: [values: CreateUserDto]
}>()

function formValues(values?: Partial<CreateUserDto>): UserFormValues {
  return {
    firstName: values?.firstName ?? '',
    lastName: values?.lastName ?? '',
    email: values?.email ?? '',
    username: values?.username ?? '',
    password: values?.password ?? '',
    age: values?.age === undefined ? '' : String(values.age),
    gender: values?.gender ?? '',
    phone: values?.phone ?? '',
  }
}

const { handleSubmit, errors, defineField, resetForm, isSubmitting } = useForm<UserFormValues>({
  initialValues: formValues(props.initialValues),
  validationSchema: toTypedSchema(
    yup.object({
      firstName: yup.string().trim().required('Вкажіть ім’я'),
      lastName: yup.string().trim().required('Вкажіть прізвище'),
      email: yup.string().email('Некоректний email').required('Вкажіть email'),
      username: yup.string().required('Вкажіть username'),
      password:
        props.mode === 'create'
          ? yup.string().min(6, 'Мінімум 6 символів').required('Вкажіть пароль')
          : yup.string().notRequired(),
      age: yup
        .string()
        .required('Вкажіть вік')
        .matches(/^[1-9]\d*$/, 'Вік має бути цілим числом більшим за 0'),
      gender: yup.string().required('Вкажіть стать'),
      phone: yup.string().required('Вкажіть телефон'),
    }),
  ),
})

const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [email] = defineField('email')
const [username] = defineField('username')
const [password] = defineField('password')
const [age] = defineField('age')
const [gender] = defineField('gender')
const [phone] = defineField('phone')

const passwordModel = computed<string | number>({
  get: () => password.value ?? '',
  set: (value) => {
    password.value = String(value)
  },
})

watch(
  () => props.initialValues,
  (values) => resetForm({ values: formValues(values) }),
)

const submit = handleSubmit((values) => {
  const payload: CreateUserDto = {
    ...values,
    password: values.password ?? '',
    age: Number(values.age),
  }

  emit('submit', payload)
})
</script>

<template>
  <form class="user-form" @submit.prevent="submit">
    <AppInput id="user-first-name" v-model="firstName" label="Ім’я" :error="errors.firstName" />
    <AppInput id="user-last-name" v-model="lastName" label="Прізвище" :error="errors.lastName" />
    <AppInput id="user-email" v-model="email" label="Email" type="email" :error="errors.email" />
    <AppInput id="user-username" v-model="username" label="Username" :error="errors.username" />
    <AppInput
      id="user-password"
      v-model="passwordModel"
      label="Пароль"
      type="password"
      :error="errors.password"
    />
    <AppInput id="user-age" v-model="age" label="Вік" type="number" :error="errors.age" />
    <AppInput id="user-gender" v-model="gender" label="Стать" :error="errors.gender" />
    <AppInput id="user-phone" v-model="phone" label="Телефон" type="tel" :error="errors.phone" />

    <AppButton
      type="submit"
      :label="mode === 'create' ? 'Створити користувача' : 'Зберегти зміни'"
      :loading="isSubmitting"
    />
  </form>
</template>

<style scoped>
.user-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 640px) {
  .user-form {
    grid-template-columns: 1fr;
  }
}
</style>
