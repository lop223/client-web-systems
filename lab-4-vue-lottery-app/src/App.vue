<script setup lang="ts">
import RegisterForm from '@/components/RegisterForm.vue'

const isEmailTaken = (): boolean => false
</script>

<template>
  <main class="container py-5">
    <RegisterForm :is-email-taken="isEmailTaken" @submit="console.log($event)" />
  </main>
</template>