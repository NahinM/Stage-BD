import { refreshAccessToken } from "@/store/User/user";

export const useAuth = async <T>(func: () => Promise<{ data: T }>): Promise<T | null> => {

    try {
        const response = await func();
        // console.log("Auth response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Auth error:", error.response?.data?.message ?? error.message);
        await refreshAccessToken();
        try {
            const response = await func();
            // console.log("Auth response after refresh:", response.data);
            return response.data;
        } catch (errorAfter: any) {
            console.error("Auth error after refresh:", errorAfter.response?.data?.message ?? errorAfter.message);
            return null;
        }
    }
};