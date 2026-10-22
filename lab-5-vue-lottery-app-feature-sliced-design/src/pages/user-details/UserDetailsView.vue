<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ServiceProvider } from '@/shared/api'
import { UserService, useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'

const props = defineProps<{ id: string }>()

const router = useRouter()
const usersStore = useUsersStore()

const user = ref<User | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    user.value = await ServiceProvider.get<UserService>('users').getById(Number(props.id))
  } catch (cause: unknown) {
    error.value = cause instanceof Error ? cause.message : 'Не вдалося завантажити користувача.'
  } finally {
    isLoading.value = false
  }
})

async function deleteUser() {
  if (!user.value) return

  try {
    await usersStore.removeUser(user.value.id)
    await router.push({ name: 'users' })
  } catch (cause: unknown) {
    error.value = cause instanceof Error ? cause.message : 'Не вдалося видалити користувача.'
  }
}
</script>

<template>
  <section>
    <p v-if="isLoading">Завантаження...</p>
    <p v-else-if="error" role="alert">{{ error }}</p>

    <template v-else-if="user">
      <h1>{{ user.firstName }} {{ user.lastName }}</h1>
      <dl>
        <dt>Email</dt>
        <dd>{{ user.email }}</dd>

        <dt>Username</dt>
        <dd>{{ user.username }}</dd>

        <dt>Вік</dt>
        <dd>{{ user.age }}</dd>

        <dt>Стать</dt>
        <dd>{{ user.gender }}</dd>

        <dt>Телефон</dt>
        <dd>{{ user.phone }}</dd>
      </dl>

      <RouterLink :to="{ name: 'user-edit', params: { id: user.id } }"> Редагувати </RouterLink>

      <button type="button" @click="deleteUser">Видалити</button>
    </template>
  </section>
</template>
