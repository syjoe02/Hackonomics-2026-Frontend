import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
    const { accessToken, logout } = useAuth();
    const naviagte = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout/", {}, { withCredentials: true });
        } catch (e) {
            console.warn("Logout API failed, but continuing local logout");
        } finally {
            logout();
            naviagte("/login");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-bold mb-4">My Page</h1>

            <p className="text-gray-600 mb-2">
                🎉 MyPage ...
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