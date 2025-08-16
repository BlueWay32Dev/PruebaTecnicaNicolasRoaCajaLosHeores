import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { useBooksApi } from "~/composables/useBooksApi";

export const useBookDetailsStore = defineStore("bookDetails", () => {
  const book = ref(null);
  const loading = ref(false);
  const review = ref("");
  const rating = ref(0);
  const selectedCover = ref("");

  const toast = useToast();
  const api = useBooksApi();

  async function fetchBook(id) {
    loading.value = true;
    try {
      const res = await api.getBookById(id);
      book.value = {
        ...res,
        authors: Array.isArray(res.authors)
          ? res.authors.join(", ")
          : res.authors || "Desconocido",
        publisher: res.publisher || "Desconocida",
        publishYear: res.publishYear || "N/A",
        cover: res.cover || "",
      };
      selectedCover.value = book.value.cover;
    } catch {
      toast.error("No se pudo cargar el libro");
    } finally {
      loading.value = false;
    }
  }

  function updateReview(value) {
    if (value.length > 500) {
      toast.error("No pueden ser más de 500 caracteres!");
      review.value = value.slice(0, 500);
      return;
    }
    review.value = value;
  }

  async function addToLibrary() {
    if (!book.value) return;

    if (!review.value.trim()) {
      toast.error("Falta indicar la reseña");
      return;
    }

    if (review.value.length > 500) {
      toast.error("No pueden ser más de 500 caracteres!");
      return;
    }

    if (rating.value < 1) {
      toast.error("Debes dar al menos 1 estrella");
      return;
    }

    loading.value = true;
    try {
      const payload = {
        id: book.value.id,
        openLibraryKey: book.value.id,
        title: book.value.title,
        authors: book.value.authors.split(",").map((a) => a.trim()),
        publishYear: book.value.publishYear,
        review: review.value,
        rating: rating.value,
        cover: selectedCover.value,
      };
      await api.addToLibrary(payload);
      toast.success("Libro guardado en tu biblioteca");
    } catch (err) {
      if (err.message.includes("ya está en tu biblioteca")) {
        toast.error("Este libro ya está en tu biblioteca");
      } else {
        toast.error(err?.message || "No se pudo guardar el libro");
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    book,
    loading,
    review,
    rating,
    selectedCover,
    fetchBook,
    addToLibrary,
    updateReview,
  };
});
