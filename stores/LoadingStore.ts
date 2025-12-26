// stores/LoadingStore.ts
import { makeAutoObservable } from "mobx"

export class LoadingStore {
    isLoading = false
    loadingText = "Loading..."

    constructor() {
        makeAutoObservable(this)
    }

    startLoading = (text: string = "Loading...") => {
        this.isLoading = true
        this.loadingText = text
    }

    stopLoading = () => {
        this.isLoading = false
        this.loadingText = "Loading..."
    }
}
