import { makeAutoObservable, runInAction } from "mobx";
import { getApiUrl } from "@/config/api";

export class FlyersStore {
  flyers = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch all flyers from backend
  fetchFlyers = async () => {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(getApiUrl("/api/flyers"), {
        cache: "no-store",
      });

      const data = await response.json();

      runInAction(() => {
        this.flyers = data;
        this.loading = false;
      });

    } catch (err: any) {
      runInAction(() => {
        this.error = err.message;
        this.loading = false;
      });
    }
  };

  // Extract all unique categories from flyers
  get allCategories() {
    const categorySet = new Set<string>();

    this.flyers.forEach((flyer: any) => {
      if (Array.isArray(flyer.categories)) {
        flyer.categories.forEach((cat: string) => {
          categorySet.add(cat);
        });
      }
    });

    return Array.from(categorySet).sort();
  }

  // Get categories with their flyer counts
  get categoriesWithCounts() {
    const counts: Record<string, number> = {};

    this.flyers.forEach((flyer: any) => {
      if (Array.isArray(flyer.categories)) {
        flyer.categories.forEach((cat: string) => {
          counts[cat] = (counts[cat] || 0) + 1;
        });
      }
    });

    return counts;
  }

  // Helpers — computed filters
  get recentlyAdded() {
    return this.flyers.filter((f: any) => f.recentlyAdded || f.recently_added);
  }

  get premiumFlyers() {
    return this.flyers.filter((f: any) => {
      const price = typeof f.price === 'string' ? parseFloat(f.price.replace('$', '')) : f.price;
      return price === 40;
    });
  }

  get basicFlyers() {
    return this.flyers.filter((f: any) => {
      const price = typeof f.price === 'string' ? parseFloat(f.price.replace('$', '')) : f.price;
      return price === 10;
    });
  }

  flyersByCategory(category: string) {
    return this.flyers.filter((f: any) =>
      Array.isArray(f.categories) && f.categories.includes(category)
    );
  }
}
