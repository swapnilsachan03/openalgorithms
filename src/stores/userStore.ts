import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  isAdmin: boolean;
  userId: string | null;
  token: string | null;
  isLoggedIn: boolean;
  actions: {
    setIsAdmin: (isAdmin: boolean) => void;
    setUserId: (userId: string | null) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUserToken: (token: string | null) => void;
  };
}

const useUserStore = create<UserState>()(
  persist(
    set => ({
      isAdmin: false,
      userId: null,
      isLoggedIn: false,
      token: null,
      actions: {
        setIsAdmin: isAdmin => set({ isAdmin }),
        setUserId: userId => set({ userId }),
        setIsLoggedIn: isLoggedIn => set({ isLoggedIn }),
        setUserToken: token => set({ token }),
      },
    }),
    {
      storage: createJSONStorage(() => sessionStorage),
      name: "user-store",
      partialize: state => ({
        isAdmin: state.isAdmin,
        userId: state.userId,
        isLoggedIn: state.isLoggedIn,
        token: state.token,
      }),
    }
  )
);

export const useIsAdmin = () => useUserStore(state => state.isAdmin);
export const useUserId = () => useUserStore(state => state.userId);
export const useIsLoggedIn = () => useUserStore(state => state.isLoggedIn);
export const useUserToken = () => useUserStore(state => state.token);
export const useUserActions = () => useUserStore(state => state.actions);
