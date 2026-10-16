<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const { users, total, isLoading, error } = storeToRefs(usersStore)

const searchInput = ref('')
const showCreateForm = ref(false)
const createForm = ref<CreateUserDto>({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  age: 18,
  gender: 'male',
  phone: '',
})

const page = computed(() => {
  const value = route.query.page
  const parsedPage = typeof value === 'string' ? Number(value) : 1

  return Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
})

const searchQuery = computed(() => {
  const value = route.query.q
  return typeof value === 'string' ? value : ''
})

const pageCount = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

watch(
  searchQuery,
  (query) => {
    searchInput.value = query
  },
  { immediate: true },
)

watch(
  [page, searchQuery],
  ([currentPage, currentQuery]) => {
    void usersStore.load({
      limit: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
      q: currentQuery,
    })
  },
  { immediate: true },
)

function resetCreateForm() {
  showCreateForm.value = false
  createForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    age: 18,
    gender: 'male',
    phone: '',
  }
}

async function createUser() {
  const payload = { ...createForm.value }

  if (!payload.firstName.trim() || !payload.lastName.trim() || !payload.email.trim()) {
    return
  }

  const created = await usersStore.create(payload)

  resetCreateForm()

  if (created) {
    await router.push({ name: 'user-details', params: { id: created.id } })
  }
}

function searchUsers() {
  const query = searchInput.value.trim()

  void router.push({
    name: 'users',
    query: {
      ...route.query,
      q: query || undefined,
      page: undefined,
    },
  })
}

function goToPage(nextPage: number) {
  if (isLoading.value || nextPage < 1 || nextPage > pageCount.value) {
    return
  }

  void router.push({
    name: 'users',
    query: {
      ...route.query,
      page: nextPage === 1 ? undefined : String(nextPage),
    },
  })
}
</script>

<template>
  <section class="users-page">
    <div class="page-header">
      <h1>Users</h1>
      <button type="button" class="add-user-button" @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? 'Close' : 'Add user' }}
      </button>
    </div>

    <form v-if="showCreateForm" class="create-user-form" @submit.prevent="createUser">
      <div class="form-grid">
        <label>
          First name
          <input v-model="createForm.firstName" required />
        </label>

        <label>
          Last name
          <input v-model="createForm.lastName" required />
        </label>

        <label>
          Email
          <input v-model="createForm.email" type="email" required />
        </label>

        <label>
          Username
          <input v-model="createForm.username" required />
        </label>

        <label>
          Password
          <input v-model="createForm.password" type="password" required />
        </label>

        <label>
          Age
          <input v-model.number="createForm.age" type="number" min="1" required />
        </label>

        <label>
          Gender
          <input v-model="createForm.gender" required />
        </label>

        <label>
          Phone
          <input v-model="createForm.phone" type="tel" required />
        </label>
      </div>

      <div class="form-actions">
        <button type="button" class="secondary-button" @click="resetCreateForm">Cancel</button>
        <button type="submit">Create user</button>
      </div>
    </form>

    <form class="users-search" @submit.prevent="searchUsers">
      <label for="user-search">Пошук користувачів</label>

      <input
        id="user-search"
        v-model="searchInput"
        type="search"
        placeholder="Введіть ім’я або запит"
      />

      <button type="submit">Шукати</button>
    </form>

    <p v-if="isLoading" role="status">Завантаження користувачів...</p>

    <p v-else-if="error" class="error-message" role="alert">
      Не вдалося завантажити користувачів: {{ error }}
    </p>

    <template v-else>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">Ім’я</th>
              <th scope="col">Прізвище</th>
              <th scope="col">Email</th>
              <th scope="col">Вік</th>
              <th scope="col">Стать</th>
              <th scope="col">Телефон</th>
              <th scope="col">Дії</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.age }}</td>
              <td>{{ user.gender }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <div class="table-actions">
                  <RouterLink
                    :to="{ name: 'user-edit', params: { id: user.id } }"
                    class="table-action table-action--secondary"
                  >
                    Редагувати
                  </RouterLink>
                  <RouterLink
                    :to="{ name: 'user-details', params: { id: user.id } }"
                    class="table-action table-action--primary"
                  >
                    Детально
                  </RouterLink>
                </div>
              </td>
            </tr>

            <tr v-if="users.length === 0">
              <td colspan="7">Користувачів не знайдено.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav class="pagination" aria-label="Пагінація користувачів">
        <button type="button" :disabled="isLoading || page <= 1" @click="goToPage(page - 1)">
          Попередня
        </button>

        <span>Сторінка {{ page }} з {{ pageCount }}</span>

        <button
          type="button"
          :disabled="isLoading || page >= pageCount"
          @click="goToPage(page + 1)"
        >
          Наступна
        </button>
      </nav>

      <p>Усього користувачів: {{ total }}</p>
    </template>
  </section>
</template>

<style scoped lang="scss">
.users-page {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.add-user-button,
.secondary-button {
  min-height: 2.5rem;
  padding: 0.55rem 1rem;
  border-radius: 12px;
  font-weight: 600;
}

.add-user-button {
  background: var(--brand-primary);
  color: white;
  border: 1px solid var(--brand-primary);
}

.secondary-button {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}

.create-user-form {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface-muted);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-grid label {
  display: grid;
  gap: 0.4rem;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.users-search {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface-muted);

  label {
    flex-basis: 100%;
    margin: 0;
    color: var(--text);
    font-weight: 600;
  }

  input {
    min-width: 16rem;
    flex: 1 1 16rem;
  }

  button {
    min-width: 7rem;
  }
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 0.9rem 0.75rem;
  border-bottom: 1px solid var(--border);
}

.table-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.table-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.2rem;
  padding: 0.45rem 0.8rem;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.table-action:hover {
  text-decoration: none;
  transform: translateY(-1px);
}

.table-action--primary {
  background: var(--brand-primary);
  color: #fff;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.18);
}

.table-action--secondary {
  background: transparent;
  border-color: var(--border);
  color: var(--text);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 0;
  color: var(--text-muted);
}

.pagination button {
  min-width: 7rem;
}

.error-message {
  color: #dc2626;
  font-weight: 600;
}

@media (max-width: 767.98px) {
  .users-page {
    padding: 1rem;
  }

  .page-header,
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .users-search {
    padding: 0.75rem;
  }

  .pagination {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
