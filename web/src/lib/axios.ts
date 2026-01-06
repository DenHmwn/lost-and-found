import axios, { AxiosHeaders } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("accessToken");
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
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
        const refreshResponse = await api.get("/auth/refresh");
        const newToken =
          refreshResponse?.data?.accessToken &&
          typeof refreshResponse.data.accessToken === "string"
            ? refreshResponse.data.accessToken
            : null;
        if (newToken && typeof window !== "undefined") {
          window.localStorage.setItem("accessToken", newToken);
        }
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
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
    }
    window.location.href = "/login";
  }
}
