import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../auth/useAuth";
import { useEffect, useState } from "react";
import { api } from "@/api/client";


interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, setAccessToken } = useAuth();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        async function tryRefresh() {
            if (isAuthenticated) {
                setChecking(false);
                return;
            }

            try {
                const res = await api.post("/auth/refresh/");
                const newAccessToken = res.data.access_token;
                setAccessToken(newAccessToken);
            } catch {
                // refresh failed -> login again
            } finally {
                setChecking(false);
            }
        }

        tryRefresh();
    }, [isAuthenticated, setAccessToken]);

    // Loading
    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Checking authentication...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}