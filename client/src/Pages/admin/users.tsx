import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import UserDetail from "./user-detail";
import _api from "@/authentication/private-api"
import { useEffect, useState } from "react";

const getUser = async () => {
    try {
        const response = await _api.get("/admin/users");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

export default function UserManagement() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUser().then(users => {
            console.log("Users:", users);
            setUsers(users);
        });
    }, [])

    return (
        <div className="p-4 w-full">
            <h2>User Management</h2>
            <p>Here you can manage all users of the platform.</p>
            {/* User management functionalities will go here */}
            <Table>
                <TableCaption>A list of your recent users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Username</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        users.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{user.firstname} {user.lastname}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Detail</DialogTrigger>
                                        <DialogContent>
                                            <UserDetail user={user} />
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>))
                    }
                </TableBody>
            </Table>
        </div>

    )
}