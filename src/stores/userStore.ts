import { create } from "zustand";

interface UserState {
  isAdmin: boolean;
  userId: string | null;
  isLoggedIn: boolean;
  actions: {
    setIsAdmin: (isAdmin: boolean) => void;
    setUserId: (userId: string | null) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
  };
}

// For development, we'll set some dummy values
const useUserStore = create<UserState>()(set => ({
  isAdmin: false, // Set this to true to test admin features
  userId: null,
  isLoggedIn: false,
  actions: {
    setIsAdmin: isAdmin => set({ isAdmin }),
    setUserId: userId => set({ userId }),
    setIsLoggedIn: isLoggedIn => set({ isLoggedIn }),
  },
}));

export const useIsAdmin = () => useUserStore(state => state.isAdmin);
export const useUserId = () => useUserStore(state => state.userId);
export const useIsLoggedIn = () => useUserStore(state => state.isLoggedIn);
export const useUserActions = () => useUserStore(state => state.actions);
