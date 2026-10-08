<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import type { Participant } from '@/types/participant'

defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  edit: [participant: Participant]
  delete: [participant: Participant]
}>()
</script>

<template>
  <div class="card card-body mb-3">
    <div class="table-responsive">
      <table class="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col" class="text-muted">#</th>
            <th scope="col">Name</th>
            <th scope="col">Date of Birth</th>
            <th scope="col">Email</th>
            <th scope="col">Phone number</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(participant, index) in participants" :key="participant.id">
            <td class="text-muted">{{ index + 1 }}</td>
            <td>{{ participant.name }}</td>
            <td>{{ participant.birthDate }}</td>
            <td>{{ participant.email }}</td>
            <td>{{ participant.phone }}</td>
            <td>
              <BaseButton size="sm" variant="outline-secondary" @click="emit('edit', participant)">
                Редагувати дані
              </BaseButton>
            </td>
            <td>
              <BaseButton size="sm" variant="danger" @click="emit('delete', participant)">
                Видалити учасника
              </BaseButton>
            </td>
          </tr>
          <tr v-if="!participants.length">
            <td colspan="7" class="text-center text-muted py-3">No participants yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>