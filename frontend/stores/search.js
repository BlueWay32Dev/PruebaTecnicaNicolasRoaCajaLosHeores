import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { useSearchApi } from "~/composables/useSearchApi";

export const useSearchStore = defineStore("search", () => {
  const query = ref("");
  const results = ref([]);
  const lastSearches = ref([]);
  const loading = ref(false);

  const api = useSearchApi();
  const toast = useToast();

  async function searchBooks() {
    if (!query.value) {
      toast.error("Debes ingresar un término de búsqueda");
      return;
    }

    if (!lastSearches.value.includes(query.value)) {
      lastSearches.value.unshift(query.value);
      if (lastSearches.value.length > 5) {
        lastSearches.value.pop();
      }
    }

    loading.value = true;
    results.value = [];

    try {
      results.value = await api.searchBooks(query.value);
      if (!results.value.length) toast.error("No se encontraron libros");
    } catch (err) {
      toast.error(err?.message || "Error al buscar libros");
    } finally {
      loading.value = false;
    }
  }

  function repeatSearch(term) {
    query.value = term;
    searchBooks();
  }

  return { query, results, lastSearches, loading, searchBooks, repeatSearch };
});
