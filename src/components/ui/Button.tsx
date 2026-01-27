import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function Button({
    children,
    loading = false,
    variant = 'primary',
    fullWidth = false,
    size = 'md',
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    const sizeStyles = {
        sm: "py-1.5 px-3 text-sm rounded-lg",
        md: "py-3 px-6 text-base rounded-xl",
        lg: "py-4 px-8 text-lg rounded-2xl",
    };
    const baseStyles = "font-semibold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
    };

    const widthStyle = fullWidth ? "w-full" : "";



    return (
        <button
            disabled={disabled || loading}
            className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${widthStyle} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}