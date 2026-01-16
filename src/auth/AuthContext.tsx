import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (access: string) => void;
    logout: () => void;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const login = (access: string) => {
        localStorage.setItem("access_token", access);
        setAccessToken(access);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setAccessToken(null);
    };

    const setToken = (token: string | null) => {
        if (token) {
            localStorage.setItem("access_token", token);
        } else {
            localStorage.removeItem("access_token");
        }
        setAccessToken(token);
    }

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                isAuthenticated: !!accessToken,
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