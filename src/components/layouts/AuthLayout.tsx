import AppBackground from './AppBackground';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <AppBackground>
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </AppBackground>
    );
}