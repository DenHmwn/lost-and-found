import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      originalRequest.url.includes("/auth/") &&
      originalRequest.url !== "/auth/logout"
    ) {
      return Promise.reject(error);
    }

    // Jika access token expired maka coba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.get("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Fungsi untuk logout
export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout gagal:", err);
  } finally {
    window.location.href = "/login";
  }
}