import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor untuk mengambil token dari localStorage
api.interceptors.request.use(
  (config) => {
    // Cek token di localStorage
    const token = localStorage.getItem("accessToken");
    // console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle 401 error (token expired)
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Jika 401 dan belum retry
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Panggil refresh token endpoint (buat endpoint ini kalau belum ada)
//         const { data } = await api.get("/auth/refresh");

//         // // Update token di localStorage
//         // if (data.accessToken) {
//         //   localStorage.setItem("accessToken", data.accessToken);
//         //   originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//         // }

//         localStorage.setItem("accessToken", data.accessToken);
//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

//         // Retry original request
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Redirect ke login jika refresh token juga expired
//         localStorage.removeItem("accessToken");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika refresh token expired maka langsung logout
    if (originalRequest.url.includes("/auth/refresh")) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Jika access token expired maka coba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.get("/auth/refresh");

        localStorage.setItem("accessToken", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Redirect ke login jika refresh token juga expired
        localStorage.removeItem("accessToken");
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
    await api.post("/auth/logout", {}, { withCredentials: true });

    // Hapus token di localStorage
    localStorage.removeItem("accessToken");

    // Redirect paksa ke login
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout gagal:", err);
  }
}

// Interceptor untuk handle 401 error
api.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
