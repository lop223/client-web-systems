<script setup lang="ts">
import { computed, ref } from "vue";
import type { User } from "@/types/user";

const props = defineProps<{
  user: User;
}>();

const age = computed(() => props.user.dob.age);
const birthDate = computed(() =>
  new Date(props.user.dob.date).toLocaleDateString("uk-UA"),
);
const fullName = computed(
  () => `${props.user.name.first} ${props.user.name.last}`,
);

const isDetailsVisible = ref(false);

const toggleDetails = (): void => {
  isDetailsVisible.value = !isDetailsVisible.value;
};
</script>

<template>
  <div
    class="user-card"
    :class="{
      minor: age < 18,
      young: age >= 18 && age <= 30,
      adult: age > 30 && age <= 50,
      senior: age > 50,
    }"
  >
    <img
      class="user-card__photo"
      v-bind:src="user.picture.large"
      :alt="fullName"
    />
    <h2 class="user-card__name">{{ user.name.title }} {{ fullName }}</h2>

    <ul class="user-card__info">
      <li><strong>Стать:</strong> {{ user.gender }}</li>
      <li>
        <strong>Адреса:</strong>
        {{ user.location.street.name }} {{ user.location.street.number }},
        {{ user.location.city }}, {{ user.location.country }}
      </li>
      <li><strong>Email:</strong> {{ user.email }}</li>
      <li><strong>Телефон:</strong> {{ user.phone }}</li>
      <li><strong>Дата народження:</strong> {{ birthDate }}</li>
      <li v-if="age > 18"><strong>Вік:</strong> {{ age }}</li>
    </ul>

    <div class="user-card__hobbies">
      <strong>Хобі:</strong>
      <ul>
        <li v-for="hobby in user.hobbies" :key="hobby">{{ hobby }}</li>
      </ul>
    </div>

    <button class="user-card__toggle" type="button" @click="toggleDetails">
      {{ isDetailsVisible ? "Сховати деталі" : "Показати деталі" }}
    </button>
    <p v-show="isDetailsVisible" class="user-card__details">
      {{ user.details }}
    </p>
  </div>
</template>

<style scoped>
.user-card {
  width: 320px;
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: #fff;
  color: #222;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.user-card.minor {
  background: #fff3cd;
  border-color: #ffc107;
}
.user-card.young {
  background: #d1f2eb;
  border-color: #1abc9c;
}
.user-card.adult {
  background: #d6eaf8;
  border-color: #3498db;
}
.user-card.senior {
  background: #e8daef;
  border-color: #8e44ad;
}

.user-card__photo {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
}

.user-card__name {
  margin: 12px 0;
  font-size: 1.25rem;
}

.user-card__info {
  padding: 0;
  list-style: none;
  text-align: left;
  font-size: 0.9rem;
}

.user-card__info li {
  margin-bottom: 6px;
}

.user-card__hobbies {
  text-align: left;
  font-size: 0.9rem;
}

.user-card__toggle {
  margin-top: 12px;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #333;
  color: #fff;
  cursor: pointer;
}

.user-card__details {
  margin-top: 10px;
  font-size: 0.9rem;
  font-style: italic;
}
</style>
