import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

interface UserInfo {
    id: number;
    email: string;
}

export default function MyPage() {
    const { accessToken, logout } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMe() {
            try {
                const res = await api.get("/auth/me/");
                setUser(res.data);
            } catch (e) {
                // access token이 만료됐거나 위조됐거나 하면 여기로 옴
                logout();
                navigate("/login");
            } finally {
                setLoading(false);
            }
        }

        fetchMe();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout/", {}, { withCredentials: true });
        } catch {
            console.warn("Logout API failed, but continuing local logout");
        } finally {
            logout();
            navigate("/login");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-bold mb-4">My Page</h1>

            <p className="text-gray-600 mb-2">
                🎉 Welcome, {user.email}
            </p>

            <div className="bg-white p-4 rounded-lg shadow w-[400px] break-all text-sm">
                <strong>Access Token:</strong>
                <div className="mt-2 text-gray-500">
                    {accessToken?.slice(0, 50)}...
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Logout
            </button>
        </div>
    );
}