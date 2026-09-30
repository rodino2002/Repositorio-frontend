// src/services/api.ts
import { api } from "../config/api";



// REQUEST interceptor 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token-repo");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE interceptor 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken-repo");

        const response = await api.post(
          "/refresh",
          { refreshToken }
        );

        const novoAccessToken = response.data.accessToken;

        localStorage.setItem("token-repo", novoAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${novoAccessToken}`;

        return api(originalRequest);

      } catch (err) {
        localStorage.removeItem("user-repo");
        localStorage.removeItem("token-repo");
        localStorage.removeItem("refreshToken-repo");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;