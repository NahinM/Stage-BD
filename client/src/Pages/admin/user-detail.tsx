import { useEffect, useState } from "react"
import api from "@/authentication/public-api"

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
    });
}

export default function UserDetail({ user }: { user: UserDetailProps }) {
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        getUserRoles(user.id).then(data => {
            setRoles(data);
        }).catch(error => {
            console.error("Error fetching user roles:", error);
        });
    }, [user])

    return (
        <div className="p-4 w-full text-md">
            <h2>User Detail</h2>
            <p><strong>Username:</strong> @{user.username}</p>
            <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
                <strong>Roles:</strong>
                {
                    roles.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {roles.map((role: string, index: number) => (
                                <li key={index}>{role}</li>
                            ))}
                        </ul>
                    ) : (
                        <span> No roles assigned.</span>
                    )
                }
            </p>
            <div className="mt-4 text-center">
                Add role:
            </div>
        </div>
    )
}