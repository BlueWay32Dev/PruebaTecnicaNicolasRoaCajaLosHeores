import { useApi } from "~/composables/useApi";

export function useLibrary() {
  const api = useApi();

  async function fetchBooks(params = {}) {
    return await api.get("/books/my-library", { params });
  }

  async function getBook(id) {
    return await api.get(`/books/my-library/${id}`);
  }

  async function addBook(book) {
    return await api.post("/books/my-library", book);
  }

  async function updateBook(id, payload) {
    return await api.put(`/books/my-library/${id}`, payload);
  }

  async function removeBook(id) {
    return await api.delete(`/books/my-library/${id}`);
  }

  async function getFrontCover(id) {
    return await api.get(`/books/my-library/front-cover/${id}`);
  }

  return {
    fetchBooks,
    getBook,
    addBook,
    updateBook,
    removeBook,
    getFrontCover,
  };
}
