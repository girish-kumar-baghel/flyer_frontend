// API Client for Backend Communication
import { getApiUrl } from "@/config/api";

export interface RegisterUserPayload {
    fullname: string;
    email: string;
    user_id: string;
}

export interface RegisterUserResponse {
    success: boolean;
    message?: string;
    data?: any;
}

/**
 * Register user in the backend database after successful Cognito registration
 * @param payload - User registration data
 * @returns Promise with registration response
 */
export const registerUserInDatabase = async (
    payload: RegisterUserPayload
): Promise<RegisterUserResponse> => {
    try {
        const response = await fetch(getApiUrl("/api/web/auth/register"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to register user in database");
        }

        return {
            success: true,
            message: data.message || "User registered successfully",
            data: data,
        };
    } catch (error: any) {
        console.error("Error registering user in database:", error);
        return {
            success: false,
            message: error.message || "Failed to register user in database",
        };
    }
};

/**
 * Format Cognito user ID for database storage
 * Adds provider prefix to user ID (e.g., "google_", "cognito_")
 */
export const formatCognitoUserId = (
    userId: string,
    provider: string = "cognito"
): string => {
    // If already has a provider prefix, return as is
    if (userId.includes("_")) {
        return userId;
    }

    // Add provider prefix
    return `${provider}_${userId}`;
};
