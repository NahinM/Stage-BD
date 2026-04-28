import { create } from "zustand";
import { type User } from "../../types/user-type";

interface UserState {
  user: User | null;
  userRoles: string[] | null;
  jwtToken: string | null;
  setUser: (user: UserState["user"]) => void;
  setJwtToken: (jwtToken: UserState["jwtToken"]) => void;
  setUserRoles: (userRoles: UserState["userRoles"]) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  jwtToken: null,
  userRoles: null,
  setUser: (user) => set({ user }),
  setJwtToken: (jwtToken) => set({ jwtToken }),
  setUserRoles: (userRoles) => set({ userRoles }),
  clearUser: () => set({ user: null, jwtToken: null, userRoles: null }),
}));