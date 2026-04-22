import { create } from 'zustand';

export interface Category {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  address: string;
  lat: number;
  lon: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  googleId?: string | null;
  preferredCategories: Category[];
  preferredLocations: Location[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
