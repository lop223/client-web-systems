<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import WinnersBlock from '@/components/WinnersBlock.vue'
import type { Participant, ParticipantForm } from '@/types/participant'

const MAX_WINNERS = 3

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
    <ParticipantsTable
      :participants="participants"
      @edit="editingParticipant = $event"
      @delete="deletingParticipant = $event"
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
        Ви дійсно бажаєте видалити учасника "{{ deletingParticipant.name }}",
        "{{ deletingParticipant.email }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="deletingParticipant = null">Ні</BaseButton>
      </template>
    </BaseModal>
  </main>
</template>