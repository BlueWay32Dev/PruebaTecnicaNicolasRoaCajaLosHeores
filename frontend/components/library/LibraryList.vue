<template>
  <div class="library-list">
    <div class="card">
      <div class="card__body">
        <p v-if="!lib.books.length" class="empty">
          No tienes libros guardados.
        </p>
        <LibraryItem
          v-for="book in lib.books"
          :key="book._id ?? book.id"
          :book="book"
          @edit="$emit('edit', book)"
          @remove="lib.openModal(book)"
        />
      </div>
    </div>
  </div>

  <ConfirmDeleteModal
    v-if="lib.selectedBook"
    :visible="lib.showModal"
    :book="lib.selectedBook"
    @confirm="lib.confirmDelete"
    @cancel="lib.closeModal"
  />
</template>

<script setup>
import { useLibraryStore } from "~/stores/library";
import LibraryItem from "./LibraryItem.vue";
import ConfirmDeleteModal from "./ConfirmDeleteModal.vue";

const lib = useLibraryStore();

defineEmits(["edit"]);
</script>
