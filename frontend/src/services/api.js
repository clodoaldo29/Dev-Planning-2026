import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export const planejamentoApi = {
  submit(form) {
    return api.post("/api/planejamento", form);
  },
  list(params = {}) {
    return api.get("/api/planejamento", { params });
  }
};

export const authApi = {
  login(credentials) {
    return api.post("/auth/login", credentials);
  }
};

export default api;
