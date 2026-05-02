import Nav from "@/components/nav"
import { Outlet, Link } from "react-router-dom"
import { useUserStore } from "@/store/User/user"

export default function AdminDashboard() {
    const user = useUserStore((state) => state.user);

    return (
        <div className="p-4 w-full">
            <Nav />
            <br /><br />
            <div className="p-4 w-full text-xl text-center bg-green-100/50 rounded border border-green-500">
                <h1>Admin Dashboard</h1>
                <p>Welcome, Admin <span className="text-green-700">{user?.firstname}!</span> </p>
            </div>
            <div className="mt-4 flex gap-4">
                <Link to="/admin/dashboard/users" className="text-green-500 hover:text-green-700 p-2 border border-green-500 rounded">
                    Manage Users
                </Link>
            </div>
            <Outlet />
        </div>
    )
}