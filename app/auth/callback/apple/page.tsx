"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleAppleCallback } from "@/lib/oauth-client";
import { useStore } from "@/stores/StoreProvider";
import { IOSLoader } from "@/components/ui/ios-loader";

export default function AppleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { authStore } = useStore();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            try {
                const code = searchParams.get("code");
                const errorParam = searchParams.get("error");
                const userParam = searchParams.get("user");

                if (errorParam) {
                    setError("Apple sign-in was cancelled or failed");
                    setLoading(false);
                    return;
                }

                if (!code) {
                    setError("No authorization code received");
                    setLoading(false);
                    return;
                }

                console.log("Processing Apple callback with code:", code);

                // Parse user data if provided (only on first sign-in)
                let userData = null;
                if (userParam) {
                    try {
                        userData = JSON.parse(userParam);
                    } catch (e) {
                        console.warn("Failed to parse user data:", e);
                    }
                }

                // Exchange code for user info and register in database
                const result = await handleAppleCallback(code, userData);

                if (!result.success || !result.user) {
                    setError(result.error || "Failed to sign in with Apple");
                    setLoading(false);
                    return;
                }

                console.log("Apple sign-in successful:", result.user);

                // Update auth store with user info
                authStore.setOAuthUser(result.user);

                // Redirect to home page
                router.push("/");
            } catch (err: any) {
                console.error("Apple callback error:", err);
                setError(err.message || "An unexpected error occurred");
                setLoading(false);
            }
        };

        processCallback();
    }, [searchParams, router, authStore]);

    if (loading) {
        return (
            <IOSLoader
                size="xl"
                text="Signing in with Apple..."
                color="text-red-500"
                fullScreen={true}
            />
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="mb-4 text-red-500">
                        <svg
                            className="mx-auto h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Sign-in Failed</h2>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
