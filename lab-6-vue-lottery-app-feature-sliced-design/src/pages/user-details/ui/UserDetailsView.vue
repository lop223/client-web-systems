<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { useAppConfirm, useAppToast } from '@/shared/ui'

const props = defineProps<{ id: string }>()

const router = useRouter()
const usersStore = useUsersStore()

const user = ref<User | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const toast = useAppToast()
const confirmAction = useAppConfirm()

onMounted(async () => {
  try {
    user.value = await usersStore.fetchUser(Number(props.id))
  } catch (cause: unknown) {
    error.value =
      cause instanceof Error
        ? cause.message
        : 'Не вдалося завантажити користувача.'
  } finally {
    isLoading.value = false
  }
})

function deleteUser(): void {
  if (!user.value) return

  const userId = user.value.id

  confirmAction('Видалити цього користувача?', async () => {
    try {
      await usersStore.removeUser(userId)
      toast.success('Користувача видалено')
      await router.push({ name: 'users' })
    } catch (cause: unknown) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : 'Не вдалося видалити користувача.',
      )
    }
  })
}
</script>

<template>
  <section>
    <p v-if="isLoading" role="status">Завантаження...</p>
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

      <RouterLink :to="{ name: 'user-edit', params: { id: user.id } }">
        Редагувати
      </RouterLink>

      <button type="button" @click="deleteUser">
        Видалити
      </button>
    </template>
  </section>
</template>