import axios from "axios";

export const handleSigninAPI = async (username: string, password: string) => {
    let isSignedIn = false;
    await axios.post("/api/signin", {
        username: username,
        password: password
    })
        .then(response => {
            console.log("Sign-in successful:", response.data);
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