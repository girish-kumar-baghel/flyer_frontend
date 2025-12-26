"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface IOSLoaderProps {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
    color?: string; // Tailwind text color class, e.g., "text-white", "text-gray-500"
    text?: string;
    fullScreen?: boolean;
}

export const IOSLoader: React.FC<IOSLoaderProps> = ({
    size = "sm",
    className,
    color = "text-foreground",
    text,
    fullScreen = false,
}) => {
    // Size mappings
    const sizeClasses = {
        xs: "w-4 h-4",
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    // The iOS spinner consists of 12 lines (blades)
    const blades = Array.from({ length: 12 });

    const loaderContent = (
        <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
            <div className={cn("relative inline-block", sizeClasses[size], color)}>
                {blades.map((_, i) => (
                    <div
                        key={i}
                        className="absolute left-1/2 top-0 w-[8%] h-[28%] -ml-[4%] rounded-full bg-current opacity-0 animate-spinner-leaf-fade"
                        style={{
                            transform: `rotate(${i * 30}deg) translate(0, 140%)`, // Push blades out from center
                            transformOrigin: "center 250%", // Adjust pivot point
                            animationDelay: `-${(11 - i) * 0.0833}s`,
                        }}
                    />
                ))}
            </div>
            {text && (
                <p className={cn("font-medium text-sm animate-pulse", color)}>{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
};
