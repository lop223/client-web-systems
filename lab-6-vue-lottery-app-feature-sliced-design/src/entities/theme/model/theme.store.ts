import { defineStore } from 'pinia'

interface ThemeState {
  isDark: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDark: false,
  }),

  actions: {
    toggleTheme(): void {
      this.isDark = !this.isDark
    },
  },

  persist: {
    key: 'app-theme',
    pick: ['isDark'],
  },
})
