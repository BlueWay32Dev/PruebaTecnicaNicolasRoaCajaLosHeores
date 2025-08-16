<template>
  <div class="search-results">
    <div class="grid search-grid">
      <SearchItem v-for="book in books" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<script setup>
import SearchItem from "~/components/home/SearchItem.vue";

defineProps({
  books: {
    type: Array,
    default: () => [],
  },
});
</script>
