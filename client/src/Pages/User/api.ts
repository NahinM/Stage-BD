import { useUserStore } from "@/store/User/user";
import apiClient from "@/store/api-client";

export const updateUser = (details: any) => {
    console.log("Updating user with details:", details);
    const user = useUserStore.getState().user;
    const jwtToken = useUserStore.getState().jwtToken;
    if (!user) {
        throw new Error("User not logged in");
    }
    apiClient.put(`/api/user`, details, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    }).then((response) => {
        console.log("User details update response:", response.data);
        useUserStore.getState().setUser(response.data.data);
    }).catch((error) => {
        console.error("Error updating user details:", error.response?.data?.message || error.message);
        throw error;
    });
}