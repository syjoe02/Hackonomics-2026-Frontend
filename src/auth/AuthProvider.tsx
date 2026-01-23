import { useState } from "react";
import type { ReactNode } from "react";
import { tokenStore } from "./tokenStore";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(() =>
        tokenStore.get()
    );
    const [loading] = useState(true);

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
