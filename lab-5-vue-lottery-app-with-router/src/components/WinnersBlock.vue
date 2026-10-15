<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import WinnerItem from '@/components/WinnerItem.vue'
import type { Participant } from '@/types/participant'

defineProps<{
  winners: Participant[]
  canAddWinner: boolean
}>()

const emit = defineEmits<{
  'new-winner': []
  'remove-winner': [id: number]
}>()
</script>

<template>
  <div class="card card-body mb-3">
    <div class="d-flex align-items-center gap-3">
      <div class="form-control d-flex flex-wrap align-items-center flex-grow-1">
        <WinnerItem
          v-for="winner in winners"
          :key="winner.id"
          :name="winner.name"
          @remove="emit('remove-winner', winner.id)"
        />
        <span v-if="!winners.length" class="text-muted">Winners</span>
      </div>
      <BaseButton :disabled="!canAddWinner" @click="emit('new-winner')">New winner</BaseButton>
    </div>
  </div>
</template>