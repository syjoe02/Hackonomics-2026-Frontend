// src/components/layouts/TopBar.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { api } from "@/api/client";
import { Home, LogOut } from "lucide-react";
import Button from "@/components/ui/Button";

export default function TopBar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleGoHome = () => {
        navigate("/");
    };

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout/", {}, { withCredentials: true });
        } finally {
            logout();
            navigate("/login");
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Button onClick={handleGoHome} variant="secondary">
                    <Home size={16} />
                    <span>Home</span>
                </Button>

                <Button onClick={handleLogout} variant="secondary">
                    <LogOut size={16} />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );
}