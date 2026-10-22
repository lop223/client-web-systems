<template>
  <nav class="main-nav" aria-label="Головна навігація">
    <RouterLink to="/" exact-active-class="is-active">Home</RouterLink>
    <RouterLink to="/about" active-class="is-active">About author</RouterLink>
    <RouterLink to="/users" active-class="is-active">Users</RouterLink>
    <RouterLink to="/login" active-class="is-active">Login</RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.main-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.main-nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  color: var(--text-muted);
  font-weight: 600;
  transition: all 0.2s ease;
}

.main-nav a:hover {
  background: rgba(79, 70, 229, 0.06);
  color: var(--brand-primary);
  text-decoration: none;
}

.main-nav a.is-active {
  background: var(--brand-soft);
  color: var(--brand-primary);
  box-shadow: inset 0 0 0 1px rgba(79, 70, 229, 0.1);
}
</style>
