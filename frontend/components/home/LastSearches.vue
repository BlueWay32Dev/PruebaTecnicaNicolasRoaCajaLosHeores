<template>
  <div v-if="searches.length" class="last-searches">
    <hr class="last-searches__divider" />
    <p class="last-searches__title">Búsquedas recientes</p>
    <ul class="last-searches__items">
      <li
        v-for="(search, index) in searches"
        :key="index"
        class="last-searches__item"
      >
        <button class="button button--chip" @click="$emit('repeat', search)">
          {{ search }}
        </button>
      </li>
    </ul>
    <hr class="last-searches__divider" />
  </div>
</template>

<script setup>
defineProps({
  searches: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["repeat"]);
</script>
