import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { api } from "../api/client";
import { raiseAppError } from "@/common/errors/raiseAppError";
import { AxiosError } from "axios";

export default function OAuthCallbackPage() {
    const navigate = useNavigate();
    const { setAccessToken } = useAuth();

    useEffect(() => {
        const run = async () => {
            try {
                const res = await api.post("/auth/refresh/", {}, { withCredentials: true });
                setAccessToken(res.data.access_token);
                // verify me
                await api.get("/auth/me/")
                navigate("/me", { replace: true });
            } catch (err: unknown) {
                if (err instanceof AxiosError) {
                    raiseAppError(
                        "UNAUTHORIZED",
                        navigate,
                        err.response?.data?.message
                    );
                } else {
                    raiseAppError(
                        "UNAUTHORIZED",
                        navigate,
                        "Unexpected authentication error"
                    );
                }
            }
        };

        run();
    }, [navigate, setAccessToken]);

    return <div className="text-center p-10">Logging in with Google...</div>;
}