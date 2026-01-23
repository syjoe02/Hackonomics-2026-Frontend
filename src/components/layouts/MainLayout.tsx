// src/components/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

export default function MainLayout() {
    return (
        <div className="min-h-screen">
            <TopBar />
            <div className="pt-30">
                <Outlet />
            </div>
        </div>
    );
}