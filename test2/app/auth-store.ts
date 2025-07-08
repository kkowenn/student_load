import { create } from "zustand";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  studentId: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
