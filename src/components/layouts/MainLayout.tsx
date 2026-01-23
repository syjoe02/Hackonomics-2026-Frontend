// src/components/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

export default function MainLayout() {
    return (
        <>
            <TopBar />
            <div className="pt-20">
                <Outlet />
            </div>
        </>
    );
}