import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  nameAr: string;
  nameEn: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, size?: string, color?: string) => void;
  updateQuantity: (productId: number, size: string | undefined, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const existingIdx = state.items.findIndex(
            (i) => i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
          );
          if (existingIdx >= 0) {
            const newItems = [...state.items];
            newItems[existingIdx] = {
              ...newItems[existingIdx],
              quantity: newItems[existingIdx].quantity + newItem.quantity,
            };
            return { items: newItems };
          }
          return { items: [...state.items, { ...newItem, price: Number(newItem.price) }] };
        });
      },
      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        }));
      },
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
    }),
    { name: "mh-cart-storage" }
  )
);

export const useCartTotalItems = () =>
  useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

export const useCartTotalPrice = () =>
  useCart((state) => state.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0));
