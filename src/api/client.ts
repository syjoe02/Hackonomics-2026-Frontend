import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const data = error.response?.data;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    `${API_BASE_URL}/auth/refresh/`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = res.data.access_token;
                localStorage.setItem("access_token", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // redirect
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        if (data?.code && data?.message) {
            return Promise.reject(data);
        }
        return Promise.reject({
            code: "UNKNOWN_ERROR",
            message: "Unexpected error occurred",
        });
    }
);