"use client";

import React from "react";

interface RedLoaderProps {
    size?: "sm" | "md" | "lg" | "xl";
    text?: string;
    fullScreen?: boolean;
}

export const RedLoader: React.FC<RedLoaderProps> = ({
    size = "md",
    text = "Loading...",
    fullScreen = false,
}) => {
    const sizeClasses = {
        sm: "h-8 w-8 border-2",
        md: "h-12 w-12 border-3",
        lg: "h-16 w-16 border-4",
        xl: "h-24 w-24 border-4",
    };

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
    };

    const loader = (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Spinning Circle Loader */}
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-red-500 border-t-transparent`}
                role="status"
                aria-label="Loading"
            />

            {/* Loading Text */}
            {text && (
                <p className={`${textSizeClasses[size]} font-medium text-red-500 animate-pulse`}>
                    {text}
                </p>
            )}

            {/* Pulsing Dots */}
            <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {loader}
            </div>
        );
    }

    return (
        <div className="flex min-h-[400px] items-center justify-center">
            {loader}
        </div>
    );
};

// Alternative: Skeleton Loader with Red Accent
export const RedSkeletonLoader: React.FC = () => {
    return (
        <div className="space-y-4 p-4">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-red-500/10" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-red-500/10" style={{ animationDelay: "100ms" }} />
            <div className="h-4 w-5/6 animate-pulse rounded-lg bg-red-500/10" style={{ animationDelay: "200ms" }} />
            <div className="h-4 w-4/6 animate-pulse rounded-lg bg-red-500/10" style={{ animationDelay: "300ms" }} />
        </div>
    );
};

// Inline Loader (for buttons, etc.)
export const RedInlineLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <span className="text-sm text-red-500">{text}</span>
        </div>
    );
};

// Spinner Only (no text)
export const RedSpinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
    };

    return (
        <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-red-500 border-t-transparent`}
            role="status"
            aria-label="Loading"
        />
    );
};
