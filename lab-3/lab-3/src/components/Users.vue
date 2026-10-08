<script setup lang="ts">
import UserCard from "@/components/UserCard.vue";
import usersData from "@/data/users.json";
import { computed, ref } from "vue";
import type { User } from "@/types/user";

const users = ref<User[]>(usersData as User[]);

type GenderFilter = "all" | "male" | "female";
type AgeFilter = "all" | "adult";
type SortKey = "none" | "name-asc" | "name-desc" | "age-asc" | "age-desc";

const genderFilter = ref<GenderFilter>("all");
const ageFilter = ref<AgeFilter>("all");
const sortKey = ref<SortKey>("none");

const genderButtons: { value: GenderFilter; label: string }[] = [
  { value: "all", label: "Всі" },
  { value: "male", label: "Чоловіки" },
  { value: "female", label: "Жінки" },
];

const ageButtons: { value: AgeFilter; label: string }[] = [
  { value: "all", label: "Всі" },
  { value: "adult", label: "18 +" },
];

const sortButtons: { value: Exclude<SortKey, "none">; label: string }[] = [
  { value: "name-asc", label: "Ім’я ↑" },
  { value: "name-desc", label: "Ім’я ↓" },
  { value: "age-asc", label: "Вік ↑" },
  { value: "age-desc", label: "Вік ↓" },
];

const visibleUsers = computed<User[]>(() => {
  const filtered = users.value.filter((user) => {
    const matchesGender =
      genderFilter.value === "all" || user.gender === genderFilter.value;
    const matchesAge = ageFilter.value === "all" || user.dob.age >= 18;
    return matchesGender && matchesAge;
  });

  const sorted = [...filtered];
  const fullName = (user: User): string =>
    `${user.name.first} ${user.name.last}`;

  switch (sortKey.value) {
    case "name-asc":
      sorted.sort((a, b) => fullName(a).localeCompare(fullName(b), "uk"));
      break;
    case "name-desc":
      sorted.sort((a, b) => fullName(b).localeCompare(fullName(a), "uk"));
      break;
    case "age-asc":
      sorted.sort((a, b) => a.dob.age - b.dob.age);
      break;
    case "age-desc":
      sorted.sort((a, b) => b.dob.age - a.dob.age);
      break;
  }

  return sorted;
});

const resetAll = (): void => {
  genderFilter.value = "all";
  ageFilter.value = "all";
  sortKey.value = "none";
};
</script>

<template>
  <section class="users">
    <div class="toolbar">
      <div class="toolbar__group">
        <span class="toolbar__label">Стать:</span>
        <button
          v-for="btn in genderButtons"
          :key="btn.value"
          type="button"
          class="toolbar__btn"
          :class="{ active: genderFilter === btn.value }"
          @click="genderFilter = btn.value"
        >
          {{ btn.label }}
        </button>
      </div>

      <div class="toolbar__group">
        <span class="toolbar__label">Вік:</span>
        <button
          v-for="btn in ageButtons"
          :key="btn.value"
          type="button"
          class="toolbar__btn"
          :class="{ active: ageFilter === btn.value }"
          @click="ageFilter = btn.value"
        >
          {{ btn.label }}
        </button>
      </div>

      <div class="toolbar__group">
        <span class="toolbar__label">Сортування:</span>
        <button
          v-for="btn in sortButtons"
          :key="btn.value"
          type="button"
          class="toolbar__btn"
          :class="{ active: sortKey === btn.value }"
          @click="sortKey = btn.value"
        >
          {{ btn.label }}
        </button>
      </div>

      <button type="button" class="toolbar__btn toolbar__btn--reset" @click="resetAll">
        Очистити все
      </button>
    </div>

    <p v-if="visibleUsers.length === 0" class="users__empty">Список юзерів пустий</p>
    <div v-else class="users__list">
      <UserCard v-for="user in visibleUsers" :key="user.id" :user="user" />
    </div>
  </section>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 28px;
  justify-content: center;
  margin-bottom: 24px;
}

.toolbar__group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.toolbar__label {
  font-weight: 600;
}

.toolbar__btn {
  padding: 6px 12px;
  border: 1px solid #888;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.toolbar__btn:hover {
  background: rgba(128, 128, 128, 0.2);
}

.toolbar__btn.active {
  border-color: #333;
  background: #333;
  color: #fff;
}

.toolbar__btn--reset {
  border-color: #c0392b;
  color: #c0392b;
}

.toolbar__btn--reset:hover {
  background: #c0392b;
  color: #fff;
}

.users__list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
}

.users__empty {
  text-align: center;
  font-size: 1.1rem;
}
</style>