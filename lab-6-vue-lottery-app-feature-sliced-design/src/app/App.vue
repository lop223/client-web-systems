<script setup lang="ts">
import { AppHeader } from '@/widgets/app-header'
import { AppConfirmDialog, AppToast } from '@/shared/ui'
</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <AppToast />
  <AppConfirmDialog />
</template>