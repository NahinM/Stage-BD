import { create } from "zustand";
import { type User } from "../../types/user-type";
import axios from "axios";
import { useAuth } from "@/authentication/auth";

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
  setJwtToken: (jwtToken) => {
    set({ jwtToken });
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  },
  setUserRoles: (userRoles) => set({ userRoles }),
  clearUser: () => {
    set({ user: null, jwtToken: null, userRoles: null });
    delete axios.defaults.headers.common['Authorization'];
  },
}));


export const userLogout = async () => {
  try {
    const response = await axios.post("/api/user/logout");
    console.log("Logout response:", response.data);
    useUserStore.getState().clearUser();
  } catch (error: any) {
    console.error("Logout error:", error.response?.data?.message || error.message);
  }
}

export const refreshAccessToken = async () => {
  try {
    const response = await axios.get("/api/user/refreshToken");
    console.log("Token refresh response:", response.data);
    const { accessToken, roles } = response.data;
    useUserStore.getState().setJwtToken(accessToken);
    useUserStore.getState().setUserRoles(roles);
    return accessToken;
  } catch (error: any) {
    console.error("Token refresh error:", error.response?.data?.message || error.message);
    useUserStore.getState().clearUser();
    return null;
  }
}
export const refreshAccessTokenIfNeeded = async () => {
  const jwtToken = useUserStore.getState().jwtToken;
  if (!jwtToken) {
    await refreshAccessToken();
  }
}

export const refreshUser = async () => {
  try {
    const data: User | null = await useAuth(() => axios.get("http://localhost:3000/api/user"));
    console.log("User refresh response:", data);
    if (data) {
      useUserStore.getState().setUser(data);
    }
  } catch (error) {
    console.error("Error refreshing user data:", error);
  }
}

export const refreshUserIfNeeded = async () => {
  if (useUserStore.getState().user) return; // User data is already available, no need to refresh
  await refreshUser();
}

export const getAccessToken = async () => {
  const token = useUserStore.getState().jwtToken;
  if (!token) {
    return await refreshAccessToken();
  }
  return token;
}