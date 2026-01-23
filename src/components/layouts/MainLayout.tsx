import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import AppBackground from "./AppBackground";


export default function MainLayout() {
    return (
        <AppBackground>
            <div className="min-h-screen">
                <TopBar />
                <div className="pt-20">
                    <Outlet />
                </div>
            </div>
        </AppBackground>
    );
}