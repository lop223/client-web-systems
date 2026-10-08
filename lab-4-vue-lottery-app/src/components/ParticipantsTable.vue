<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import type { Participant, SortDirection, SortKey } from '@/types/participant'

defineProps<{
  participants: Participant[]
  sortKey: SortKey | null
  sortDirection: SortDirection
}>()

const emit = defineEmits<{
  edit: [participant: Participant]
  delete: [participant: Participant]
  sort: [key: SortKey]
}>()

function sortIcon(activeKey: SortKey | null, key: SortKey, direction: SortDirection): string {
  if (activeKey !== key) return 'bi-arrow-down-up'
  const alpha = key === 'name'
  if (direction === 'asc') return alpha ? 'bi-sort-alpha-down' : 'bi-sort-numeric-down'
  return alpha ? 'bi-sort-alpha-up' : 'bi-sort-numeric-up'
}
</script>

<template>
  <div class="card card-body mb-3">
    <div class="table-responsive">
      <table class="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col" class="text-muted">#</th>
            <th scope="col">
              <button
                type="button"
                class="btn btn-link p-0 text-decoration-none text-reset fw-bold"
                @click="emit('sort', 'name')"
              >
                Name <i class="bi" :class="sortIcon(sortKey, 'name', sortDirection)"></i>
              </button>
            </th>
            <th scope="col">
              <button
                type="button"
                class="btn btn-link p-0 text-decoration-none text-reset fw-bold"
                @click="emit('sort', 'birthDate')"
              >
                Date of Birth
                <i class="bi" :class="sortIcon(sortKey, 'birthDate', sortDirection)"></i>
              </button>
            </th>
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
