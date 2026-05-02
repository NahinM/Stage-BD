import Nav from "@/components/nav"
import { Outlet, Link } from "react-router-dom"

export default function AdminDashboard() {
    return (
        <div className="p-4 w-full">
            <Nav />
            <br /><br />
            <h1>Admin Dashboard</h1>
            <p>Welcome, Admin!</p>
            <div className="mt-4 flex gap-4">
                <Link to="/admin/dashboard/users" className="text-blue-500 hover:text-blue-700 p-2 border border-blue-500 rounded">
                    Manage Users
                </Link>
            </div>
            <Outlet />
        </div>
    )
}