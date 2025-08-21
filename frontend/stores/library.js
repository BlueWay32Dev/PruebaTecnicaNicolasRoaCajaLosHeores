import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import { useLibrary } from "~/composables/useLibraryApi";

export const useLibraryStore = defineStore("library", () => {
  const books = ref([]);
  const loading = ref(false);

  const showModal = ref(false);
  const selectedBook = ref(null);

  const search = ref("");
  const sortBy = ref("");
  const onlyWithReview = ref(false);

  const toast = useToast();
  const api = useLibrary();

  function openModal(book) {
    selectedBook.value = book;
    showModal.value = true;
  }

  function closeModal() {
    selectedBook.value = null;
    showModal.value = false;
  }

  async function confirmDelete() {
    if (!selectedBook.value) return;
    try {
      await removeBook(selectedBook.value.apiId ?? selectedBook.value.id);
      toast.success("Libro eliminado");
      fetchBooks();
    } catch (err) {
      console.error(err?.message || "No se pudo eliminar el libro");
    } finally {
      closeModal();
    }
  }

  async function fetchBooks(params = {}) {
    loading.value = true;
    try {
      const fetched = await api.fetchBooks(params);

      books.value = fetched.map((b) => ({
        ...b,
        coverSrc: resolveCover(b),
      }));
    } catch (e) {
      toast.error("No se pudieron cargar los libros");
    } finally {
      loading.value = false;
    }
  }

  function resolveCover(book) {
    const c = book.cover || "";
    if (c.startsWith("data:")) return c;

    const base = import.meta.env.VITE_API_BASE || "https://pruebatecnicanicolasroacajalosheores.onrender.com/api";
    return `${base}/books/my-library/front-cover/${book.apiId}`;
  }

  function applyFilters() {
    fetchBooks({ search: search.value, hasReview: onlyWithReview.value });
  }

  const filteredBooks = computed(() => {
    let result = [...books.value];

    if (search.value) {
      result = result.filter((b) =>
        [b.title, ...(b.authors || [])]
          .join(" ")
          .toLowerCase()
          .includes(search.value.toLowerCase())
      );
    }

    if (sortBy.value) {
      result = result.filter((b) => (b.rating || 0) === Number(sortBy.value));
    }

    return result;
  });

  async function addBook(book) {
    try {
      const saved = await api.addBook(book);
      books.value.push(saved);
      toast.success("Libro agregado");
    } catch (err) {
      toast.error(err?.message || "No se pudo agregar");
    }
  }

  async function updateBook(id, payload) {
    try {
      const updated = await api.updateBook(id, payload);
      const idx = books.value.findIndex((b) => b.id === id || b.apiId === id);
      if (idx !== -1) books.value[idx] = updated;
      toast.success("Libro actualizado");
    } catch (err) {
      toast.error(err?.message || "No se pudo actualizar");
    }
  }

  async function removeBook(id) {
    try {
      await api.removeBook(id);
      books.value = books.value.filter((b) => b.id !== id && b.apiId !== id);
    } catch (err) {
      toast.error(err?.message || "No se pudo eliminar");
    }
  }

  return {
    books,
    loading,
    search,
    sortBy,
    onlyWithReview,
    showModal,
    selectedBook,
    openModal,
    closeModal,
    confirmDelete,
    fetchBooks,
    applyFilters,
    filteredBooks,
    addBook,
    updateBook,
    removeBook,
  };
});
