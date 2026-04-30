import axios from "axios";
import { getAccessToken, refreshAccessToken } from "@/store/User/user";

const _api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});

_api.interceptors.request.use(
    async responce => {
        const token = await getAccessToken();
        if (token) {
            responce.headers['Authorization'] = `Bearer ${token}`;
        }
        return responce;
    }
);

_api.interceptors.response.use(
    async response => {
        if (response.status === 401) {
            console.log("refreshing token...");
            const newToken = await refreshAccessToken();
            if (newToken) {
                response.config.headers['Authorization'] = `Bearer ${newToken}`;
                return axios(response.config);
            }
        }
        return response;
    }
);
