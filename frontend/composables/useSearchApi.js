import { useApi } from "~/composables/useApi";

export function useSearchApi() {
  const api = useApi();

  function searchBooks(query) {
    return api.get(`/books/search?q=${encodeURIComponent(query)}`);
  }

  return {
    searchBooks,
  };
}
