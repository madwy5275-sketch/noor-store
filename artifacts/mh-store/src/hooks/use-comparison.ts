import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 3;

interface ComparisonStore {
  productIds: number[];
  add: (id: number) => boolean;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  isSelected: (id: number) => boolean;
  isFull: () => boolean;
}

export const useComparison = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      add: (id) => {
        const { productIds } = get();
        if (productIds.includes(id)) return true;
        if (productIds.length >= MAX) return false;
        set({ productIds: [...productIds, id] });
        return true;
      },
      remove: (id) => set((s) => ({ productIds: s.productIds.filter((i) => i !== id) })),
      toggle: (id) => {
        const { productIds, add, remove } = get();
        if (productIds.includes(id)) remove(id);
        else add(id);
      },
      clear: () => set({ productIds: [] }),
      isSelected: (id) => get().productIds.includes(id),
      isFull: () => get().productIds.length >= MAX,
    }),
    { name: "mh-comparison" }
  )
);
