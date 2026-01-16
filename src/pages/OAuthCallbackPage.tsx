import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function OAuthCallbackPage() {
    const navigate = useNavigate();
    const { setAccessToken } = useAuth();

    useEffect(() => {
        async function fetchAccessToken() {
            try {
                const res = await fetch("/api/auth/refresh/", {
                    method: "POST",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("refresh failed");

                const data = await res.json();
                setAccessToken(data.access_token);
                navigate("/me");
            } catch {
                navigate("/login");
            }
        }

        fetchAccessToken();
    }, []);

    return <div>Logging in with Google...</div>;
}