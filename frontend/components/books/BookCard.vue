<template>
  <div class="card book-card">
    <img
      v-if="book.cover"
      :src="book.cover"
      :alt="book.title"
      class="card__image book-card__cover"
    />
    <div class="card__body book-card__body">
      <h3 class="card__title book-card__title">{{ book.title }}</h3>
      <p class="card__subtitle book-card__author">{{ book.author }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true,
  },
});
</script>
