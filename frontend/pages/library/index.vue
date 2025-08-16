<template>
  <div class="library-page">
    <LibraryFilters
      v-model:search="lib.search"
      v-model:sort="lib.sortBy"
      v-model:onlyReviewed="lib.onlyWithReview"
      @filter="lib.applyFilters"
    />

    <div class="library-list-card">
      <p v-if="!lib.filteredBooks.length" class="library-empty">
        No tienes libros guardados.
      </p>

      <div class="library-list">
        <LibraryItem
          v-for="book in lib.filteredBooks"
          :key="book._id ?? book.id"
          :book="book"
          @edit="goToEdit"
        />
      </div>
    </div>

    <!-- Modal de confirmación -->
    <ConfirmDeleteModal
      v-if="lib.selectedBook"
      :visible="lib.showModal"
      :book="lib.selectedBook"
      @confirm="lib.confirmDelete"
      @cancel="lib.closeModal"
    />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLibraryStore } from "~/stores/library";

import LibraryFilters from "@/components/library/LibraryFilters.vue";
import LibraryItem from "@/components/library/LibraryItem.vue";
import ConfirmDeleteModal from "@/components/library/ConfirmDeleteModal.vue";

const lib = useLibraryStore();
const router = useRouter();

onMounted(() => {
  lib.fetchBooks();
});

function goToEdit(book) {
  router.push(`/library/edit/${book.apiId}`);
}
</script>
