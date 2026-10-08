<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import WinnersBlock from '@/components/WinnersBlock.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { Participant, ParticipantForm, SortDirection, SortKey } from '@/types/participant'

const MAX_WINNERS = 3

const filterName = ref('')
const sortKey = ref<SortKey | null>(null)
const sortDirection = ref<SortDirection>('asc')

const participants = ref<Participant[]>([])
const winnerIds = ref<number[]>([])

const editingParticipant = ref<Participant | null>(null)
const deletingParticipant = ref<Participant | null>(null)

const winners = computed<Participant[]>(() =>
  winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => p !== undefined),
)

const availableParticipants = computed<Participant[]>(() =>
  participants.value.filter((p) => !winnerIds.value.includes(p.id)),
)

const canAddWinner = computed<boolean>(
  () => winnerIds.value.length < MAX_WINNERS && availableParticipants.value.length > 0,
)

const editingValues = computed<ParticipantForm | undefined>(() => {
  if (!editingParticipant.value) return undefined
  const { name, birthDate, email, phone } = editingParticipant.value
  return { name, birthDate, email, phone }
})

function isEmailTaken(email: string, excludeId?: number): boolean {
  const normalized = email.trim().toLowerCase()
  return participants.value.some((p) => p.id !== excludeId && p.email.toLowerCase() === normalized)
}

function addParticipant(values: ParticipantForm): void {
  participants.value.push({ id: Date.now(), ...values })
}

function addWinner(): void {
  if (!canAddWinner.value) return
  const pool = availableParticipants.value
  const winner = pool[Math.floor(Math.random() * pool.length)]
  if (!winner) return
  winnerIds.value.push(winner.id)
}

function removeWinner(id: number): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}

function updateParticipant(values: ParticipantForm): void {
  if (!editingParticipant.value) return
  const id = editingParticipant.value.id
  participants.value = participants.value.map((p) => (p.id === id ? { id, ...values } : p))
  editingParticipant.value = null
}

function confirmDelete(): void {
  if (!deletingParticipant.value) return
  const id = deletingParticipant.value.id
  participants.value = participants.value.filter((p) => p.id !== id)
  // Каскадно видаляємо з переможців
  removeWinner(id)
  deletingParticipant.value = null
}

const visibleParticipants = computed<Participant[]>(() => {
  const query = filterName.value.toLowerCase()
  // 1. Фільтрація (filter повертає новий масив)
  const filtered = participants.value.filter((p) => p.name.toLowerCase().includes(query))

  // 2. Сортування (на копії)
  const key = sortKey.value
  if (!key) return filtered
  const factor = sortDirection.value === 'asc' ? 1 : -1
  return [...filtered].sort((a, b) =>
    key === 'name'
      ? a.name.localeCompare(b.name) * factor
      : a.birthDate.localeCompare(b.birthDate) * factor,
  )
})

function setFilter(name: string): void {
  filterName.value = name
}

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}
</script>

<template>
  <main class="container py-5" style="max-width: 760px">
    <WinnersBlock
      :winners="winners"
      :can-add-winner="canAddWinner"
      @new-winner="addWinner"
      @remove-winner="removeWinner"
    />
    <RegisterForm :is-email-taken="isEmailTaken" @submit="addParticipant" />
    <SearchBar @filter-by-name="setFilter" />
    <ParticipantsTable
      :participants="visibleParticipants"
      :sort-key="sortKey"
      :sort-direction="sortDirection"
      @edit="editingParticipant = $event"
      @delete="deletingParticipant = $event"
      @sort="toggleSort"
    />

    <!-- Редагування -->
    <BaseModal :show="editingParticipant !== null" @close="editingParticipant = null">
      <template #header>Редагування учасника</template>
      <RegisterForm
        v-if="editingParticipant"
        :key="editingParticipant.id"
        id-prefix="edit"
        title=""
        subtitle=""
        submit-label="Оновити дані"
        :bordered="false"
        :initial-values="editingValues"
        :exclude-id="editingParticipant.id"
        :is-email-taken="isEmailTaken"
        @submit="updateParticipant"
      />
    </BaseModal>

    <!-- Видалення -->
    <BaseModal :show="deletingParticipant !== null" @close="deletingParticipant = null">
      <template #header>Підтвердження</template>
      <p v-if="deletingParticipant" class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ deletingParticipant.name }}", "{{
          deletingParticipant.email
        }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="deletingParticipant = null">Ні</BaseButton>
      </template>
    </BaseModal>
  </main>
</template>
