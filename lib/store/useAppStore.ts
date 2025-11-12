// lib/store/useAppStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CharacterSimple = {
  id: number;
  name: string;
  image: string;
  species?: string;
};

type AppState = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;

  page: number;
  setPage: (p: number) => void;

  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;

  clearAll: () => void;

  initFavorites: () => void;
};

const GUEST_KEY = "rm-favs:guest";
const USER_KEY = (token: string) => `rm-favs:${token}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      token: null,
      setToken: (t: string | null) => {
        if (typeof document !== "undefined") {
          if (t) {
            document.cookie = `token=${t}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
          } else {
            document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
          }
        }

        set({ token: t });

        if (typeof window !== "undefined") {
          try {
            if (t) {
              const guest = JSON.parse(localStorage.getItem(GUEST_KEY) || "[]") as number[];
              const user = JSON.parse(localStorage.getItem(USER_KEY(t)) || "[]") as number[];
              const merged = Array.from(new Set([...(user || []), ...(guest || [])]));
              localStorage.setItem(USER_KEY(t), JSON.stringify(merged));
              localStorage.removeItem(GUEST_KEY);
              set({ favorites: merged });
            } else {
              const current = get().favorites || [];
              localStorage.setItem(GUEST_KEY, JSON.stringify(current));
              set({ favorites: [] });
            }
          } catch {
          }
        }
      },
      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        }
        if (typeof window !== "undefined") {
          try {
            const cur = get().favorites || [];
            localStorage.setItem(GUEST_KEY, JSON.stringify(cur));
          } catch { }
        }
        set({ token: null, favorites: [] });
      },

      page: 1,
      setPage: (p: number) => set({ page: p }),

      favorites: [],
      toggleFavorite: (id: number) =>
        set((state) => {
          const exists = state.favorites.includes(id);
          const newFavs = exists ? state.favorites.filter((x) => x !== id) : [...state.favorites, id];

          if (typeof window !== "undefined") {
            try {
              const token = get().token;
              const key = token ? USER_KEY(token) : GUEST_KEY;
              localStorage.setItem(key, JSON.stringify(newFavs));
            } catch {
            }
          }

          return { favorites: newFavs };
        }),

      isFavorite: (id: number) => get().favorites.includes(id),

      clearAll: () => {
        if (typeof document !== "undefined") {
          document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        }
        try {
          localStorage.removeItem(GUEST_KEY);
          const token = get().token;
          if (token) localStorage.removeItem(USER_KEY(token));
        } catch { }
        set({ token: null, favorites: [], page: 1 });
      },

      initFavorites: () => {
        if (typeof window === "undefined") return;
        try {
          const token = get().token;
          if (token) {
            const userKey = USER_KEY(token);
            const userVal = localStorage.getItem(userKey);
            if (userVal) {
              const parsed = JSON.parse(userVal || "[]") as number[];
              set({ favorites: parsed });
              return;
            }

            const guestVal = localStorage.getItem(GUEST_KEY);
            if (guestVal) {
              const guestArr = JSON.parse(guestVal || "[]") as number[];
              const merged = Array.from(new Set(guestArr));
              localStorage.setItem(userKey, JSON.stringify(merged));
              localStorage.removeItem(GUEST_KEY);
              set({ favorites: merged });
              return;
            }

            set({ favorites: [] });
          } else {
            const guestVal = localStorage.getItem(GUEST_KEY);
            const arr = guestVal ? (JSON.parse(guestVal) as number[]) : [];
            set({ favorites: arr || [] });
          }
        } catch {
          set({ favorites: [] });
        }
      },
    }),
    {
      name: "rm-app-store",
    }
  )
);
