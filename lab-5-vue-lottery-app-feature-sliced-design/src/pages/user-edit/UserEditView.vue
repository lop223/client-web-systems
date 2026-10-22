<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ServiceProvider } from '@/shared/api'
import { UserService, useUsersStore } from '@/entities/user'
import type { UpdateUserDto } from '@/entities/user'

const props = defineProps<{ id: string }>()

const router = useRouter()
const usersStore = useUsersStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  age: 0,
  gender: '',
  phone: '',
})

const isLoading = ref(true)
const isSaving = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const user = await ServiceProvider.get<UserService>('users').getById(Number(props.id))

    form.firstName = user.firstName
    form.lastName = user.lastName
    form.email = user.email
    form.username = user.username
    form.age = user.age
    form.gender = user.gender
    form.phone = user.phone
  } catch (cause: unknown) {
    error.value = cause instanceof Error ? cause.message : 'Не вдалося завантажити користувача.'
  } finally {
    isLoading.value = false
  }
})

async function saveUser() {
  isSaving.value = true
  error.value = null

  const data: UpdateUserDto = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    username: form.username,
    age: form.age,
    gender: form.gender,
    phone: form.phone,
  }

  if (form.password.trim()) {
    data.password = form.password
  }

  try {
    const updated = await usersStore.updateUser(Number(props.id), data)
    await router.push({
      name: 'user-details',
      params: { id: updated.id },
    })
  } catch (cause: unknown) {
    error.value = cause instanceof Error ? cause.message : 'Не вдалося зберегти користувача.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section>
    <h1>Редагування користувача</h1>

    <p v-if="isLoading">Завантаження...</p>
    <p v-if="error" role="alert">{{ error }}</p>

    <form v-if="!isLoading" @submit.prevent="saveUser">
      <label>
        Ім’я
        <input v-model="form.firstName" required />
      </label>

      <label>
        Прізвище
        <input v-model="form.lastName" required />
      </label>

      <label>
        Email
        <input v-model="form.email" type="email" required />
      </label>

      <label>
        Username
        <input v-model="form.username" required />
      </label>

      <label>
        Новий пароль (необов’язково)
        <input v-model="form.password" type="password" />
      </label>

      <label>
        Вік
        <input v-model.number="form.age" type="number" min="1" required />
      </label>

      <label>
        Стать
        <input v-model="form.gender" required />
      </label>

      <label>
        Телефон
        <input v-model="form.phone" type="tel" required />
      </label>

      <button type="submit" :disabled="isSaving">
        {{ isSaving ? 'Збереження...' : 'Зберегти' }}
      </button>
    </form>
  </section>
</template>
