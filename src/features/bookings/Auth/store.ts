// src/features/bookings/Auth/store.ts
import { create } from "zustand";

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
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("accessToken"),

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
}));
