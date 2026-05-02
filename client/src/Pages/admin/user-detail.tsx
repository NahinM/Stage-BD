import { useEffect, useState } from "react"
import api from "@/authentication/public-api"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import _api from "@/authentication/private-api"

interface UserDetailProps {
    bio: string,
    birthyear: number,
    city: string,
    email: string,
    firstname: string,
    gender: string,
    id: string,
    lastname: string,
    phone: string,
    username: string
}

const getUserRoles = (userId: string) => {
    return api.get(`/user/role`, { params: { userID: userId } }).then(response => {
        console.log("User Roles Response:", response.data);
        return response.data.map((role: any) => role.role);
    }).catch(error => {
        console.error("Error fetching user roles:", error);
        return [];
    });
}

const addUserRole = (userId: string, role: string) => {
    return _api.post(`/user/role`, { userID: userId, role: role }).then(response => {
        console.log("Add Role Response:", response.data);
        toast.success(response.message || "Role added successfully");
        return response.data;
    }).catch(error => {
        toast.error(error.response?.data?.message || "Error adding role");
        return Promise.reject(error);
    });
}

const removeUserRole = (userId: string, role: string) => {
    return _api.delete(`/user/role`, { data: { userID: userId, role: role } }).then(response => {
        console.log("Remove Role Response:", response.data);
        toast.success(response.message || "Role removed successfully");
        return response.data;
    }).catch(error => {
        toast.error(error.response?.data?.message || "Error removing role");
        return Promise.reject(error);
    });
}

export default function UserDetail({ user }: { user: UserDetailProps }) {
    const [roles, setRoles] = useState<string[]>([]);
    const [newRole, setNewRole] = useState("");

    const handleAddRole = () => {
        if (newRole === "" || roles.includes(newRole)) return;
        addUserRole(user.id, newRole).then(() => {
            setRoles(prevRoles => [...prevRoles, newRole]);
            setNewRole("");
        }).catch(error => {
            console.error("Error adding role:", error);
        });
    };

    const handleDeleteRole = (role: string) => {
        removeUserRole(user.id, role).then(() => {
            getUserRoles(user.id).then(data => {
                setRoles(data);
            });
        }).catch(error => {
            console.error("Error removing role:", error);
        });
    };

    useEffect(() => {
        getUserRoles(user.id).then(data => {
            setRoles(data);
        }).catch(error => {
            console.error("Error fetching user roles:", error);
        });
    }, [user])

    return (
        <div className="p-4 w-full text-md text-center">
            <h2 className="text-lg font-bold border-b p-1 mb-1">User Detail</h2>
            <p><strong>Username:</strong> @{user.username}</p>
            <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>User Roles</p>
            {/* user role table */}
            {roles.length === 0 ? <p>No roles assigned.</p> :
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr>
                            <th className="p-1 border" >Role</th>
                            <th className="p-1 border" >Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role: string) => (
                            <tr key={role}>
                                <td className="p-1 border">{role}</td>
                                <td className="p-1 border">
                                    <button
                                        onClick={() => handleDeleteRole(role)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-0 px-2 rounded">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            <div className="mt-4 flex justify-center items-center gap-2">
                New role
                <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                ["audience", "organizer", "artist", "staff", "sponsor", "admin"].map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <button
                onClick={handleAddRole}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded mt-4">
                Add Role
            </button>
        </div>
    )
}