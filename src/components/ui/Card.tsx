import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 ${className}`}>
            {children}
        </div>
    );
}