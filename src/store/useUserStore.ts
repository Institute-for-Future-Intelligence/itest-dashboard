import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, RolePermissions } from '../types';
import { DEFAULT_PERMISSIONS } from '../types';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  getUserPermissions: () => RolePermissions | null;
  hasPermission: (permission: keyof RolePermissions) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      getUserPermissions: () => {
        const { user } = get();
        if (!user || !user.role || !(user.role in DEFAULT_PERMISSIONS)) {
          return null;
        }
        return DEFAULT_PERMISSIONS[user.role];
      },
      hasPermission: (permission) => {
        const { user } = get();
        if (!user || !user.role || !(user.role in DEFAULT_PERMISSIONS)) {
          return false;
        }
        return DEFAULT_PERMISSIONS[user.role][permission];
      },
    }),
    {
      name: 'user-store', // localStorage key
    }
  )
);
