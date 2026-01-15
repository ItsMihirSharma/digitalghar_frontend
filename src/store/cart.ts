"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import type { CartItem, Product } from "@/types";

interface CartState {
    items: CartItem[];
    total: number;
    isLoading: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    syncWithServer: () => Promise<void>;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            isLoading: false,

            addToCart: (product: Product) => {
                const { items } = get();

                // Check if already in cart
                if (items.some((item) => item.id === product.id)) {
                    return;
                }

                const newItem: CartItem = {
                    id: product.id,
                    title: product.title,
                    slug: product.slug,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    imageUrl: product.imageUrl,
                    category: {
                        name: product.category?.name || "",
                        slug: product.category?.slug || "",
                    },
                };

                const newItems = [...items, newItem];
                const newTotal = newItems.reduce(
                    (sum, item) => sum + Number(item.price),
                    0
                );

                set({ items: newItems, total: newTotal });
            },

            removeFromCart: (productId: string) => {
                const { items } = get();
                const newItems = items.filter((item) => item.id !== productId);
                const newTotal = newItems.reduce(
                    (sum, item) => sum + Number(item.price),
                    0
                );

                set({ items: newItems, total: newTotal });
            },

            clearCart: () => {
                set({ items: [], total: 0 });
            },

            syncWithServer: async () => {
                // Optional: sync cart with server when user logs in
                try {
                    const { items } = get();
                    if (items.length > 0) {
                        // In future: POST items to server for logged-in users
                        // await api.post("/cart/sync", { items: items.map(i => i.id) });
                    }
                } catch (error) {
                    console.error("Failed to sync cart:", error);
                }
            },

            getItemCount: () => {
                return get().items.length;
            },
        }),
        {
            name: "digitalghar-cart",
            partialize: (state) => ({ items: state.items, total: state.total }),
        }
    )
);
