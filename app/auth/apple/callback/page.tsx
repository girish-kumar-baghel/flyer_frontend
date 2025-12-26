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
    const [debugInfo, setDebugInfo] = useState<string>("");

    useEffect(() => {
        const processCallback = async () => {
            try {
                console.log("🍎 Apple OAuth Callback Page Loaded");
                console.log("🍎 Current URL:", window.location.href);

                const code = searchParams.get("code");
                const errorParam = searchParams.get("error");
                const userParam = searchParams.get("user");
                const state = searchParams.get("state");

                console.log("🍎 Authorization Code:", code ? `${code.substring(0, 20)}...` : "MISSING");
                console.log("🍎 Error Parameter:", errorParam || "None");
                console.log("🍎 User Parameter:", userParam ? "Present" : "None");
                console.log("🍎 State:", state || "None");

                if (errorParam) {
                    console.error("❌ Apple OAuth Error:", errorParam);
                    setError("Apple sign-in was cancelled or failed");
                    setDebugInfo(`Error: ${errorParam}`);
                    setLoading(false);
                    return;
                }

                if (!code) {
                    console.error("❌ No authorization code received");
                    setError("No authorization code received from Apple");
                    setDebugInfo("Code parameter is missing from URL");
                    setLoading(false);
                    return;
                }

                console.log("✅ Authorization code received, exchanging for user info...");
                setDebugInfo("Exchanging authorization code...");

                // Parse user data if provided (only on first sign-in)
                let userData = null;
                if (userParam) {
                    try {
                        userData = JSON.parse(userParam);
                        console.log("👤 User data from Apple:", userData);
                    } catch (e) {
                        console.warn("Failed to parse user data:", e);
                    }
                }

                // Exchange code for user info and register in database
                const result = await handleAppleCallback(code, userData);

                console.log("🍎 Callback Result:", result);

                if (!result.success || !result.user) {
                    console.error("❌ Failed to get user info:", result.error);
                    setError(result.error || "Failed to sign in with Apple");
                    setDebugInfo(`Error: ${result.error}`);
                    setLoading(false);
                    return;
                }

                console.log("✅ Apple sign-in successful!");
                console.log("👤 User Info:", {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                    provider: result.user.provider
                });

                setDebugInfo("Setting user session...");

                // Update auth store with user info
                authStore.setOAuthUser(result.user);

                console.log("✅ User session set in AuthStore");
                console.log("🔄 Redirecting to home page...");

                setDebugInfo("Login successful! Redirecting...");

                // Small delay to ensure state is updated
                setTimeout(() => {
                    router.push("/");
                }, 500);

            } catch (err: any) {
                console.error("❌ Apple callback error:", err);
                console.error("❌ Error stack:", err.stack);
                setError(err.message || "An unexpected error occurred");
                setDebugInfo(`Exception: ${err.message}`);
                setLoading(false);
            }
        };

        processCallback();
    }, [searchParams, router, authStore]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="text-center">
                    <IOSLoader
                        size="xl"
                        text="Signing in with Apple..."
                        color="text-red-500"
                        fullScreen={false}
                    />
                    {debugInfo && (
                        <p className="mt-4 text-sm text-gray-400">{debugInfo}</p>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="text-center max-w-md px-4">
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
                    <h2 className="text-xl font-semibold mb-2 text-white">Sign-in Failed</h2>
                    <p className="text-gray-400 mb-4">{error}</p>
                    {debugInfo && (
                        <p className="text-xs text-gray-500 mb-4 font-mono">{debugInfo}</p>
                    )}
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Return to Home
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-2 px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
