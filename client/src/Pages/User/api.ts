import { useUserStore } from "@/store/User/user";
import apiClient from "@/store/api-client";

export const updateUser = async (details: any) => {
    console.log("Updating user with details:", details);
    try {
        const { user, jwtToken } = useUserStore();
        if (!user) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.put(`/api/user`, details, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        console.log("User details update response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating user details:", error);
        throw error;
    }
}