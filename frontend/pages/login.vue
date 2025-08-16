<template>
  <div class="login-page">
    <div class="login-card">
      <h1>{{ mode === "login" ? "Iniciar Sesión" : "Crear Cuenta" }}</h1>

      <form v-if="mode === 'login'" @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Usuario" required />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
        />
        <button type="submit" :disabled="loading">Ingresar</button>
        <p class="toggle" @click="mode = 'register'">
          ¿No tienes cuenta? Regístrate
        </p>
      </form>

      <form v-else @submit.prevent="register">
        <input v-model="username" type="text" placeholder="Usuario" required />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
        />
        <button type="submit" :disabled="loading">Crear cuenta</button>
        <p class="toggle" @click="mode = 'login'">
          ¿Ya tienes cuenta? Inicia sesión
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import useLogin from "~/composables/useLogin";

definePageMeta({ layout: "empty" });

const { username, password, loading, mode, login, register } = useLogin();
</script>
