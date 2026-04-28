import { create } from "zustand";
import { type User } from "../../types/user-type";
import axios from "axios";

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


export const userLogout = async () => {
  axios.post("/api/user/logout").then(response => {
    console.log("Logout response:", response.data);
    useUserStore.getState().clearUser();
  }).catch(error => {
    console.error("Logout error:", error.response?.data?.message || error.message);
  });
}