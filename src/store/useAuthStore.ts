import { create } from 'zustand';
import { apiFetch } from '@/lib/api';

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
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchProfile: async () => {
    try {
      const user = await apiFetch<User>('/user/profile');
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
