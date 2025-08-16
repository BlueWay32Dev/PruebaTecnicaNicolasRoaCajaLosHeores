import { useToast } from "vue-toastification";

export default defineNuxtRouteMiddleware((to, from) => {
  const token = localStorage.getItem("authToken");
  const toast = useToast();

  if (!token && to.path !== "/login") {
    toast.error("Sesión caducada, vuelva a iniciar");
    return navigateTo("/login");
  }
});
