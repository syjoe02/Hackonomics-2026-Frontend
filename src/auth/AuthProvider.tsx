import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { tokenStore } from "./tokenStore";
import { AuthContext } from "./AuthContext";
import { api } from "@/api/client";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const bootstrap = async () => {
            try {
                const res = await api.post("/auth/refresh/", {}, { withCredentials: true });
                const token = res.data.access_token;

                tokenStore.set(token);
                setAccessToken(token);
            } catch {
                tokenStore.clear();
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, []);

    const login = (access: string) => {
        tokenStore.set(access)
        setAccessToken(access);
    };

    const logout = () => {
        tokenStore.clear();
        setAccessToken(null);
    };

    const setToken = (token: string | null) => {
        if (token) {
            tokenStore.set(token);
        } else {
            tokenStore.clear();
        }
        setAccessToken(token);
    }

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                isAuthenticated: !!accessToken,
                loading,
                login,
                logout,
                setAccessToken: setToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
