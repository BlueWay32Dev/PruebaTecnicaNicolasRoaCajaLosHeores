<template>
  <div class="item">
    <img class="cover" :src="book.coverSrc" alt="cover" />

    <div class="meta">
      <h3 class="title">{{ book.title }}</h3>
      <p class="line"><b>Año:</b> {{ book.publishYear ?? "N/A" }}</p>

      <div class="stars">
        <RatingStars :model-value="book.rating || 0" readonly />
      </div>

      <div class="actions">
        <button class="button button--edit" @click="$emit('edit', book)">
          ✏️ Editar
        </button>
        <button class="button button--remove" @click="lib.openModal(book)">
          🗑️ Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import RatingStars from "~/components/books/RatingStars.vue";
import { useLibraryStore } from "~/stores/library";

defineProps({
  book: { type: Object, required: true },
});

const lib = useLibraryStore();
</script>
