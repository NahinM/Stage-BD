import axios from "axios";
import { getAccessToken } from "@/store/User/user";

const _api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});

_api.interceptors.request.use(
    async response => {
        const token = await getAccessToken();
        if (token) {
            response.headers['Authorization'] = `Bearer ${token}`;
        }
        return response;
    }
);

export default _api;