"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { IOSLoader } from "./ios-loader";

const GlobalLoader = observer(() => {
    const { loadingStore } = useStore();

    if (!loadingStore.isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <IOSLoader
                size="md"
                color="text-red-500"
                text={loadingStore.loadingText}
            />
        </div>
    );
});

export default GlobalLoader;
