import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useApi } from "~/composables/useApi";
import { useToast } from "vue-toastification";

export default function useLogin() {
  const username = ref("");
  const password = ref("");
  const loading = ref(false);
  const mode = ref("login");

  const router = useRouter();
  const api = useApi();
  const toast = useToast();
  const auth = useAuthStore();

  async function login() {
    loading.value = true;
    try {
      const res = await api.post("/auth/login", {
        username: username.value,
        password: password.value,
      });
      auth.setToken(res.token);
      toast.success("Inicio de sesión exitoso");
      router.push("/");
    } catch {
      toast.error("Credenciales inválidas");
    } finally {
      loading.value = false;
    }
  }

  async function register() {
    loading.value = true;
    try {
      await api.post("/auth/register", {
        username: username.value,
        password: password.value,
      });
      toast.success("Usuario creado, ahora inicia sesión");
      mode.value = "login";
    } catch {
      toast.error("No se pudo registrar el usuario");
    } finally {
      loading.value = false;
    }
  }

  return { username, password, loading, mode, login, register };
}
