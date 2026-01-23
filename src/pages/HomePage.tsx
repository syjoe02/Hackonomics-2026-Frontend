// src/pages/HomePage.tsx
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-900 flex items-center justify-center p-8">
            <Card className="w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Hackonomics Home
                </h1>

                <p className="text-gray-600 mb-6">
                    This is a temporary homepage for testing navigation and layout.
                </p>

                <div className="space-y-3">
                    <Button
                        fullWidth
                        variant="primary"
                        onClick={() => navigate("/me")}
                    >
                        Go to My Page
                    </Button>

                    <Button
                        fullWidth
                        variant="secondary"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Button>
                </div>

                <p className="mt-6 text-sm text-gray-500">
                    UI / Routing / Auth Flow test page
                </p>
            </Card>
        </div>
    );
}