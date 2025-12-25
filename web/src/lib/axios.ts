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

    // A. Jika request ke endpoint refresh token itu sendiri gagal (401/403)
    // Berarti sesi benar-benar habis, paksa logout.
    if (originalRequest.url.includes("/auth/refresh") && error.response) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // B. Jika Access Token Expired (401) dan belum pernah retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Panggil endpoint refresh.
        // Backend akan memperbarui Cookie access_token secara otomatis lewat header 'Set-Cookie'.
        // Kita TIDAK PERLU mengambil data.accessToken atau menyimpannya manual.
        await api.get("/auth/refresh");

        // Retry request awal.
        // Karena cookie sudah diperbarui browser, request ini akan otomatis membawa token baru.
        return api(originalRequest);
        
      } catch (refreshError) {
        // Jika refresh gagal (misal refresh token juga expired)
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
    // Panggil API Logout (Backend akan menghapus cookie dengan Set-Cookie expired)
    await api.post("/auth/logout");
    
    // Redirect ke login
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout gagal:", err);
    // Tetap redirect meski API error agar user tidak terjebak
    window.location.href = "/login";
  }
}

