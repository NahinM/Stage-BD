import Nav from "@/components/nav"
import { Outlet, Link } from "react-router-dom"

export default function AdminDashboard() {
    return (
        <div className="p-4 w-full">
            <Nav pages={[
                { name: "Home", href: "/" },
                { name: "Feed", href: "/feed" }
            ]} />
            <br /><br />
            <h1>Admin Dashboard</h1>
            <p>Welcome, Admin!</p>
            <div>
                <Link to="/admin/dashboard/users" className="text-blue-500 hover:text-blue-700">
                    Manage Users
                </Link>
            </div>
            <Outlet />
        </div>
    )
}