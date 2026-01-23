import { createContext } from "react";

export interface AuthContextType {
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (access: string) => void;
    logout: () => void;
    setAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);