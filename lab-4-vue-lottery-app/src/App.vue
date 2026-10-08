<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

const name = ref('')
</script>

<template>
  <main class="container py-5">
    <BaseInput id="name" v-model="name" label="Name" placeholder="Enter user name" />
    <BaseButton>Save</BaseButton>
  </main>
</template>