<template>
  <div class="book-detail-page">
    <BookDetail
      v-if="bookDetails.book"
      :book="bookDetails.book"
      :loading="bookDetails.loading"
      :review="bookDetails.review"
      :rating="bookDetails.rating"
      @add-to-library="bookDetails.addToLibrary"
      @update:review="bookDetails.review = $event"
      @update:rating="bookDetails.rating = $event"
    />
    <p v-else class="loading">Cargando libro...</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBookDetailsStore } from "~/stores/booksDetails";
import BookDetail from "~/components/books/BookDetail.vue";

const route = useRoute();
const bookDetails = useBookDetailsStore();

onMounted(() => {
  bookDetails.fetchBook(route.params.id);
});
</script>
