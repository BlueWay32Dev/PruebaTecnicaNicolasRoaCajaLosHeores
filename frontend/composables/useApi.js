import { useRouter } from "vue-router";

export function useApi() {
  const router = useRouter();
  const baseURL = "https://pruebatecnicanicolasroacajalosheores.onrender.com/api";

  async function request(endpoint, options = {}) {
    const token = localStorage.getItem("authToken");

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const res = await fetch(`${baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        alert("Sesión caducada, vuelva a iniciar");
        router.push("/login");
        throw new Error("Sesión caducada");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la petición");
      }

      return await res.json();
    } catch (err) {
      console.error("API error:", err.message);
      throw err;
    }
  }

  return {
    get: (endpoint) => request(endpoint, { method: "GET" }),
    post: (endpoint, body) =>
      request(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint, body) =>
      request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: "DELETE" }),
  };
}
