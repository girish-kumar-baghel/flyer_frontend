"use client";

import { useStore } from "@/stores/StoreProvider";
import { useCallback } from "react";

/**
 * Hook to control the loading state
 * Use this in your components when making API calls
 */
export const useLoading = () => {
    const { loadingStore } = useStore();

    const startLoading = useCallback(
        (text: string = "Loading...") => {
            loadingStore.startLoading(text);
        },
        [loadingStore]
    );

    const stopLoading = useCallback(() => {
        loadingStore.stopLoading();
    }, [loadingStore]);

    /**
     * Wraps an async function with loading state
     * @param fn - The async function to execute
     * @param loadingText - Optional loading text to display
     * @returns The result of the async function
     */
    const withLoading = useCallback(
        async <T,>(fn: () => Promise<T>, loadingText?: string): Promise<T> => {
            try {
                startLoading(loadingText);
                const result = await fn();
                return result;
            } finally {
                stopLoading();
            }
        },
        [startLoading, stopLoading]
    );

    return {
        startLoading,
        stopLoading,
        withLoading,
        isLoading: loadingStore.isLoading,
    };
};
