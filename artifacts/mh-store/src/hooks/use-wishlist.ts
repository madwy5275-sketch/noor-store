import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  items: number[];
  toggle: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  count: number;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) => {
        const { items } = get();
        if (items.includes(id)) {
          set({ items: items.filter((i) => i !== id) });
        } else {
          set({ items: [...items, id] });
        }
      },
      isWishlisted: (id) => get().items.includes(id),
      get count() {
        return get().items.length;
      },
    }),
    { name: "mh-wishlist" }
  )
);
