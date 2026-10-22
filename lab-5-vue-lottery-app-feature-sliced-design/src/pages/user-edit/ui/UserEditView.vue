<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { CreateUserDto, UpdateUserDto } from '@/entities/user'
import { UserForm } from '@/features/user-form'
import { useAppToast } from '@/shared/ui'

const props = defineProps<{ id: string }>()

const router = useRouter()
const usersStore = useUsersStore()
const toast = useAppToast()

const isLoading = ref(true)
const error = ref<string | null>(null)
const initialValues = ref<Partial<CreateUserDto> | undefined>()

onMounted(async () => {
  try {
    const user = await usersStore.fetchUser(Number(props.id))

    initialValues.value = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
    }
  } catch (cause: unknown) {
    error.value =
      cause instanceof Error
        ? cause.message
        : 'Не вдалося завантажити користувача.'
  } finally {
    isLoading.value = false
  }
})

async function saveUser(values: CreateUserDto): Promise<void> {
  const data: UpdateUserDto = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    username: values.username,
    age: values.age,
    gender: values.gender,
    phone: values.phone,
  }

  if (values.password.trim()) {
    data.password = values.password
  }

  try {
    const updated = await usersStore.updateUser(Number(props.id), data)

    toast.success('Дані користувача оновлено')

    await router.push({
      name: 'user-details',
      params: { id: updated.id },
    })
  } catch (cause: unknown) {
    toast.error(
      cause instanceof Error
        ? cause.message
        : 'Не вдалося зберегти користувача.',
    )
  }
}
</script>

<template>
  <section>
    <h1>Редагування користувача</h1>

    <p v-if="isLoading" role="status">Завантаження...</p>
    <p v-else-if="error" role="alert">{{ error }}</p>

    <UserForm
      v-else-if="initialValues"
      mode="edit"
      :initial-values="initialValues"
      @submit="saveUser"
    />
  </section>
</template>