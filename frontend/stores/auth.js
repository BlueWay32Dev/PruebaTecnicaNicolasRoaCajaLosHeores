import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("authToken", token);
    },
    clear() {
      this.token = null;
      localStorage.removeItem("authToken");
    },
    loadFromStorage() {
      this.token = localStorage.getItem("authToken");
    },
  },
});
