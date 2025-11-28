// src/features/bookings/Auth/store.ts
import { create } from "zustand";
import { getMe } from "./authApi";

type Avatar = {
  url: string;
  alt?: string;
};

type User = {
  name: string;
  email: string;
  avatar?: Avatar | null;
  venueManager?: boolean;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  init: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("accessToken"),
  loading: true,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, token: null });
  },

  // 🔥 Fetch user at startup if token exists
  init: async () => {
    const token = get().token;
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const me = await getMe();
      set({ user: me, loading: false });
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      set({ user: null, token: null, loading: false });
      localStorage.removeItem("accessToken");
    }
  },
}));
