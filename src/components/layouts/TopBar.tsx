import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { api } from "@/api/client";
import { Home, LogOut, User } from "lucide-react";
import Button from "@/components/ui/Button";

export default function TopBar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleGoHome = () => {
        navigate("/home");
    };

    const handleGoMyPage = () => {
        navigate("/me");
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
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/10">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Button onClick={handleGoHome} variant="secondary" size="sm">
                    <Home size={16} />
                    <span>Home</span>
                </Button>

                <div className="flex items-center gap-2">
                    <Button onClick={handleGoMyPage} variant="secondary" size="sm">
                        <User size={16} />
                        <span>MyPage</span>
                    </Button>

                    <Button onClick={handleLogout} variant="secondary" size="sm">
                        <LogOut size={16} />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}