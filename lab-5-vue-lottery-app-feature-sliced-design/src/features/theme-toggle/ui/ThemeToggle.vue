<script setup lang="ts">
import { watch } from 'vue'
import { useThemeStore } from '@/entities/settings'

const theme = useThemeStore()

watch(
  () => theme.isDark,
  (isDark) => {
    document.documentElement.classList.toggle('app-dark', isDark)
  },
  { immediate: true },
)
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-pressed="theme.isDark"
    :aria-label="theme.isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'"
    @click="theme.toggleTheme()"
  >
    {{ theme.isDark ? 'Світла тема' : 'Темна тема' }}
  </button>
</template>