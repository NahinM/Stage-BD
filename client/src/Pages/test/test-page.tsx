import axios from "axios"
import { userLogout } from "@/store/User/user";
export default function TestPage() {
    const testAPI = async () => {
        await axios.get("/api/user/refresh")
            .then(response => {
                console.log("API response:", response.data);
            })
            .catch(error => {
                console.error("API error:", error.response?.data?.message || error.message);
            });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
            <div className="p-2">
                <h1 className="text-3xl font-bold">This is a test page</h1>
                <button
                    className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={testAPI}
                >
                    Test API
                </button>
                <button
                    className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    onClick={userLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}