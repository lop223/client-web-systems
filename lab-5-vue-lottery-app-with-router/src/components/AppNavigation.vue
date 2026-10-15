<template>
  <nav aria-label="Головна навігація">
    <RouterLink to="/" exact-active-class="is-active">Home</RouterLink>
    <RouterLink to="/about" active-class="is-active">About author</RouterLink>
    <RouterLink to="/users" active-class="is-active">Users</RouterLink>
    <RouterLink to="/login" active-class="is-active">Login</RouterLink>
  </nav>
</template>

<style scoped lang="scss">
nav {
  display: flex;
  gap: 1rem;
}

.is-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>