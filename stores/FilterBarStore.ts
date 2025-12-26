import { makeAutoObservable } from "mobx"

export class FilterBarStore {
    price: string[] = []
    category: string[] = []
    type: string[] = []

    constructor() {
        makeAutoObservable(this)
    }

    priceFilter(price: string) {
        const index = this.price.indexOf(price); // check if price exists
        if (index > -1) {
            // price exists, remove it
            this.price.splice(index, 1);
        } else {
            // price does not exist, add it
            this.price.push(price);
        }
    }

    categoryFilter(category: string) {
        const index = this.category.indexOf(category);
        if (index > -1) {
            this.category.splice(index, 1);
        } else {
            this.category.push(category);
        }
    }

    typeFilter(type: string) {
        const index = this.type.indexOf(type);
        if (index > -1) {
            this.type.splice(index, 1);
        } else {
            this.type.push(type);
        }
    }

    clearFilters() {
        this.price = []
        this.category = []
        this.type = []
    }
}
