<script setup lang="ts" generic="T extends object">
defineProps<{
  rows: T[]
  columns: Array<{
    field: keyof T & string
    header: string
  }>
  loading?: boolean
}>()
</script>

<template>
  <DataTable :value="rows" :loading="loading" striped-rows responsive-layout="scroll">
    <Column
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :header="column.header"
    />
    <Column v-if="$slots.actions" header="Дії">
      <template #body="{ data }">
        <slot name="actions" :row="data" />
      </template>
    </Column>
  </DataTable>
</template>