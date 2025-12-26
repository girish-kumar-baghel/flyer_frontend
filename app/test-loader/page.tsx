"use client";

import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";

const LoaderTestPage = observer(() => {
    const { loadingStore } = useStore();

    const showLoader = (duration: number = 3000) => {
        loadingStore.startLoading("Testing loader...");
        setTimeout(() => {
            loadingStore.stopLoading();
        }, duration);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-8">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Loader Test Page</h1>
                    <p className="text-muted-foreground">
                        Click the buttons below to test the global loader
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={() => showLoader(2000)}
                        className="w-full"
                        size="lg"
                    >
                        Show Loader (2 seconds)
                    </Button>

                    <Button
                        onClick={() => showLoader(5000)}
                        className="w-full"
                        variant="outline"
                        size="lg"
                    >
                        Show Loader (5 seconds)
                    </Button>

                    <Button
                        onClick={() => {
                            loadingStore.startLoading("Custom message...");
                            setTimeout(() => loadingStore.stopLoading(), 3000);
                        }}
                        className="w-full"
                        variant="secondary"
                        size="lg"
                    >
                        Show Loader with Custom Text
                    </Button>
                </div>

                <div className="mt-8 p-4 bg-card rounded-lg border">
                    <h3 className="font-semibold mb-2">Current Status:</h3>
                    <p className="text-sm">
                        Loading: <span className="font-mono">{loadingStore.isLoading ? "true" : "false"}</span>
                    </p>
                    <p className="text-sm">
                        Text: <span className="font-mono">"{loadingStore.loadingText}"</span>
                    </p>
                </div>
            </div>
        </div>
    );
});

export default LoaderTestPage;
