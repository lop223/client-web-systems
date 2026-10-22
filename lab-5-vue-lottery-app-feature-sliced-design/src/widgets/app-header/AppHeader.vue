<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { ThemeToggle } from '@/features/theme-toggle'

import AppNavigation from './AppNavigation.vue'

const session = useSessionStore()
const router = useRouter()

async function logout() {
  session.clearSession()
  await router.replace('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <AppNavigation />

      <div class="header-actions">
        <ThemeToggle />

        <RouterLink v-if="!session.isAuthenticated" to="/login" class="header-link">
          Login
        </RouterLink>

        <button v-else type="button" class="header-button" @click="logout">Logout</button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.header-link,
.header-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  background: rgba(79, 70, 229, 0.06);
  color: var(--brand-primary);
  font-weight: 600;
  transition: all 0.2s ease;
}

.header-button {
  background: var(--brand-primary);
  color: #fff;
  border-color: var(--brand-primary);
  cursor: pointer;
}

.header-link:hover,
.header-button:hover {
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.12);
}

@media (max-width: 767.98px) {
  .header-inner {
    padding-inline: 0.75rem;
  }
}
</style>
