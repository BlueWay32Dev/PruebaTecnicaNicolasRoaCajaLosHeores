<template>
  <div class="edit-page">
    <h1>✏️ Editar libro</h1>

    <div v-if="book" class="form">
      <p>
        <strong>{{ book.title }}</strong> — {{ book.authors?.join(", ") }}
      </p>

      <label for="review">Reseña <span class="required">*</span></label>
      <textarea
        id="review"
        v-model="review"
        maxlength="500"
        placeholder="Escribe una reseña (máx 500 caracteres)"
      ></textarea>
      <div class="char-count">{{ review.length }}/500</div>

      <label>Calificación <span class="required">*</span></label>
      <RatingStars v-model="rating" />

      <div class="actions">
        <button class="save-btn" @click="onSave">💾 Guardar</button>
        <button class="cancel-btn" @click="router.push('/library')">
          Cancelar
        </button>
      </div>
    </div>

    <p v-else>Cargando...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLibraryStore } from "~/stores/library";
import RatingStars from "@/components/books/RatingStars.vue";

const lib = useLibraryStore();
const route = useRoute();
const router = useRouter();

const book = ref(null);
const review = ref("");
const rating = ref(0);

onMounted(async () => {
  if (!lib.books.length) {
    await lib.fetchBooks();
  }

  book.value = lib.books.find((b) => b.apiId === route.params.id);

  if (book.value) {
    review.value = book.value.review || "";
    rating.value = book.value.rating || 0;
  }
});

async function onSave() {
  if (!review.value.trim()) return lib.toast.error("Falta indicar la reseña");
  if (rating.value < 1)
    return lib.toast.error("Debes asignar al menos 1 estrella");

  await lib.updateBook(book.value.apiId, {
    review: review.value,
    rating: rating.value,
  });

  router.push("/library");
}
</script>
