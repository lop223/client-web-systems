<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton, AppInput, useAppToast } from '@/shared/ui'

const session = useSessionStore()
const route = useRoute()
const router = useRouter()
const toast = useAppToast()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      username: yup.string().required('Вкажіть ім’я користувача'),
      password: yup.string().required('Вкажіть пароль'),
    }),
  ),
})

const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const submitLogin = handleSubmit(async (values) => {
  try {
    await session.login(values.username, values.password)

    const redirect = route.query.redirect
    const safeRedirect =
      typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/users'

    toast.success('Ви увійшли в систему')
    await router.replace(safeRedirect)
  } catch (cause: unknown) {
    const message =
      cause instanceof Error ? cause.message : 'Не вдалося увійти. Перевірте логін і пароль.'
    toast.error(message)
  }
})
</script>

<template>
  <section>
    <h1>Вхід</h1>

    <form class="login-form" @submit.prevent="submitLogin">
      <AppInput
        id="login-username"
        v-model="username"
        label="Ім’я користувача"
        autocomplete="username"
        :error="usernameError"
      />

      <AppInput
        id="login-password"
        v-model="password"
        label="Пароль"
        type="password"
        autocomplete="current-password"
        :error="passwordError"
      />

      <AppButton type="submit" label="Увійти" :loading="isSubmitting" />
    </form>
  </section>
</template>

<style scoped>
.login-form {
  display: grid;
  gap: 1rem;
  max-width: 28rem;
}
</style>
