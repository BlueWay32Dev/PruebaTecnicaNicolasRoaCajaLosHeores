<template>
  <div>
    <AppHeader />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import AppHeader from "~/components/AppHeader.vue";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();

if (process.client) {
  auth.loadFromStorage();
}
</script>

<style lang="scss">
@use "~/assets/scss/main.scss";
</style>
