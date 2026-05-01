import { useUserStore } from "@/store/User/user";
import _api from "@/authentication/private-api";

export const updateUser = (details: any) => {
    console.log("Updating user with details:", details);

    _api.put(`/user`, details).then((response) => {
        console.log("User details update response:", response.data);
        useUserStore.getState().setUser(response.data.data);
    }).catch((error) => {
        console.error("Error updating user details:", error.response?.data?.message || error.message);
        throw error;
    });
}