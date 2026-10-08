<script setup lang="ts">
import { computed, ref } from 'vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import WinnersBlock from '@/components/WinnersBlock.vue'
import type { Participant, ParticipantForm } from '@/types/participant'

const MAX_WINNERS = 3

const participants = ref<Participant[]>([])
const winnerIds = ref<number[]>([])

const winners = computed<Participant[]>(() =>
  winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => p !== undefined),
)

// Учасники, які ще не стали переможцями
const availableParticipants = computed<Participant[]>(() =>
  participants.value.filter((p) => !winnerIds.value.includes(p.id)),
)

const canAddWinner = computed<boolean>(
  () => winnerIds.value.length < MAX_WINNERS && availableParticipants.value.length > 0,
)

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
  const winner = pool[Math.floor(Math.random() * pool.length)]!
  winnerIds.value.push(winner.id)
}

function removeWinner(id: number): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
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
    <ParticipantsTable :participants="participants" />
  </main>
</template>