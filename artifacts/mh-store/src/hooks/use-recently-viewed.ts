import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedStore {
  productIds: number[];
  addProduct: (id: number) => void;
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      addProduct: (id) => {
        const current = get().productIds.filter((i) => i !== id);
        set({ productIds: [id, ...current].slice(0, 10) });
      },
    }),
    { name: "mh-recently-viewed" }
  )
);
