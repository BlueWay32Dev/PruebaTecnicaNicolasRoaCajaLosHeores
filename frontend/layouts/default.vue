<template>
  <div>
    <AppHeader />
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.main-content {
  @media (max-width: 768px) {
    padding: 5px;
  }
}
</style>

<script setup>
import AppHeader from "~/components/AppHeader.vue";
</script>
