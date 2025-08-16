<template>
  <NuxtLink :to="`/books/${book.id}`" class="search-item">
    <div class="search-item__image-wrapper">
      <img :src="book.cover" :alt="book.title" class="search-item__cover" />
    </div>
    <div class="search-item__body">
      <h3 class="search-item__title">{{ book.title }}</h3>
      <p class="search-item__author">
        {{ (book.authors || []).join(", ") || "Autor desconocido" }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true,
  },
});
</script>
