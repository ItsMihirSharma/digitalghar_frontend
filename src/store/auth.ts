import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                const { data } = await api.post("/auth/login", { email, password });
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                set({ user: data.user, isAuthenticated: true });
            },

            register: async (email: string, password: string, name: string) => {
                const { data } = await api.post("/auth/register", {
                    email,
                    password,
                    name,
                });
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                set({ user: data.user, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                set({ user: null, isAuthenticated: false });
            },

            checkAuth: async () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    if (!token) {
                        set({ isLoading: false });
                        return;
                    }
                    const { data } = await api.get("/auth/me");
                    set({ user: data.user, isAuthenticated: true, isLoading: false });
                } catch {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
