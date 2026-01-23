import type { ReactNode } from "react";

export default function AppBackground({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            {children}
        </div>
    );
}