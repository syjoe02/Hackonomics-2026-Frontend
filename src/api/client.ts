import axios from "axios"
import { tokenStore } from "@/auth/tokenStore";
import { createAppError } from "@/common/errors/createAppError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = tokenStore.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthEndpoint =
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/signup") ||
            originalRequest.url?.includes("/auth/refresh");

        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    `${API_BASE_URL}/auth/refresh/`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = res.data.access_token;
                tokenStore.set(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                // redirect
                return api(originalRequest);
            } catch (refreshError) {
                tokenStore.clear();
                return Promise.reject(createAppError(refreshError));
            }
        }
        return Promise.reject(createAppError(error));
    }
);