import { useApi } from "~/composables/useApi";

export function useBooksApi() {
  const api = useApi();

  function getBookById(id) {
    return api.get(`/books/${id}`);
  }

  function addToLibrary(book) {
    return api.post("/books/my-library", book);
  }

  return {
    getBookById,
    addToLibrary,
  };
}
