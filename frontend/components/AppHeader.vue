<template>
  <header class="header">
    <NuxtLink to="/" class="header__logo">📚 Los Héroes</NuxtLink>

    <nav class="header__nav">
      <NuxtLink v-if="isLoggedIn" to="/" class="header__link">Buscar</NuxtLink>
      <NuxtLink v-if="isLoggedIn" to="/library" class="header__link">
        Mi Biblioteca
      </NuxtLink>

      <button v-if="isLoggedIn" @click="logout" class="header__btn">
        Cerrar sesión
      </button>
    </nav>
  </header>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
  auth.loadFromStorage();
});

const isLoggedIn = computed(() => !!auth.token);

function logout() {
  auth.clear();
  router.push("/login");
}
</script>
