import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { tokenStore } from "./tokenStore";

interface AuthContextType {
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (access: string) => void;
    logout: () => void;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = tokenStore.get();
        setAccessToken(token);
        setLoading(false);
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

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}