<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/entities/session/model/auth.store'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

async function submitLogin() {
  isLoading.value = true
  error.value = null

  try {
    await auth.login(username.value, password.value)

    const redirect = route.query.redirect
    const safeRedirect =
      typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/users'

    await router.replace(safeRedirect)
  } catch (cause: unknown) {
    error.value =
      cause instanceof Error ? cause.message : 'Не вдалося увійти. Перевірте логін і пароль.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section>
    <h1>Login</h1>

    <form @submit.prevent="submitLogin">
      <label>
        Username
        <input v-model="username" autocomplete="username" required />
      </label>

      <label>
        Password
        <input v-model="password" type="password" autocomplete="current-password" required />
      </label>

      <p v-if="error" role="alert">{{ error }}</p>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Вхід...' : 'Увійти' }}
      </button>
    </form>
  </section>
</template>
