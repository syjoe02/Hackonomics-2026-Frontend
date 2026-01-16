import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";

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
                const res = await fetch("http://localhost:8000/api/auth/refresh/", {
                    method: "POST",
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setAccessToken(data.access_token);
                }
            } catch {
                // ignore
            } finally {
                setChecking(false);
            }
        }

        tryRefresh();
    }, [isAuthenticated, setAccessToken]);

    // Loading
    if (checking) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}