<template>
  <div class="page book-detail">
    <h1 class="page__title">{{ book.title }}</h1>

    <div class="book-detail__content">
      <img
        v-if="book.cover"
        :src="book.cover"
        :alt="book.title"
        class="book-detail__cover"
      />

      <div class="book-detail__info">
        <p>
          <strong>Autor(es):</strong>
          {{ book.authors }}
        </p>

        <p><strong>Año de publicación:</strong> {{ book.publishYear }}</p>

        <div class="book-detail__review">
          <!-- Reseña -->
          <label class="form__label">
            Reseña <span class="form__required">*</span>
          </label>

          <div class="form__textarea-wrapper">
            <textarea
              :value="review"
              @input="$emit('update:review', $event.target.value)"
              class="form__textarea"
              :class="{ 'form__textarea--error': review.length > 500 }"
              placeholder="Escribe tu reseña..."
            ></textarea>

            <span
              class="form__counter"
              :class="{ 'form__counter--error': review.length > 500 }"
            >
              {{ review.length }}/500
            </span>
          </div>

          <!-- Calificación -->
          <label class="form__label">
            Calificación <span class="form__required">*</span>
          </label>
          <RatingStars
            :model-value="rating"
            @update:modelValue="$emit('update:rating', $event)"
          />
        </div>

        <button class="button button--primary" @click="$emit('add-to-library')">
          Guardar en biblioteca
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import RatingStars from "./RatingStars.vue";

defineProps({
  book: { type: Object, required: true },
  review: { type: String, default: "" },
  rating: { type: Number, default: 0 },
});

defineEmits(["update:review", "update:rating", "add-to-library"]);
</script>
