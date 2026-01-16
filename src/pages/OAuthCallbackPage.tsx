import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";

export default function OAuthCallbackPage() {
    const navigate = useNavigate();
    const { setAccessToken } = useAuth();

    useEffect(() => {
        const run = async () => {
            try {
                const res = await api.post("/auth/refresh/", {}, { withCredentials: true });
                setAccessToken(res.data.access_token);
                navigate("/me", { replace: true });
            } catch {
                navigate("/login", { replace: true });
            }
        };

        run();
    }, []);

    return <div className="text-center p-10">Logging in with Google...</div>;
}