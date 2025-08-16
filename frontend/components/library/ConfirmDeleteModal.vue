<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-card">
      <h2>❌ Confirmar eliminación</h2>

      <div class="book-cover-wrapper">
        <img :src="book.coverSrc" alt="cover" class="book-cover" />
      </div>

      <h3 class="book-title">{{ book.title }}</h3>

      <p v-if="book.review" class="book-review">“{{ book.review }}”</p>

      <div class="book-rating">
        <RatingStars :model-value="book.rating" readonly />
      </div>

      <p class="question">¿Desea eliminar la reseña de este libro?</p>

      <div class="actions">
        <button class="btn-confirm" @click="$emit('confirm', book.id)">
          Sí
        </button>
        <button class="btn-cancel" @click="$emit('cancel')">No</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import RatingStars from "@/components/books/RatingStars.vue";

defineProps({
  visible: Boolean,
  book: { type: Object, required: true },
});

defineEmits(["confirm", "cancel"]);
</script>
