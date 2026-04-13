import axios from "axios";
import { useUserStore } from "@/store/User/user";

export const handleSigninAPI = async (username: string, password: string) => {
    let isSignedIn = false;
    await axios.post("/api/signin", {
        username: username,
        password: password
    })
    .then(response => {
        console.log(response.data);
        useUserStore.getState().setUser(response.data.user);
        isSignedIn = true;
        // Handle successful sign-in, e.g., store user data, redirect, etc.
    })
    .catch(error => {
        console.error("Sign-in failed:", error.response?.data?.message || error.message);
        // Handle sign-in failure, e.g., show error message to user
        isSignedIn = false;
    });
    return isSignedIn; // Return the sign-in status
}