import { useUserStore } from "@/store/User/user";
import Nav from "@/components/nav";
import { useState } from "react";
import { Mail, Phone } from "lucide-react";

import { BioSection } from "./bio-section";
import OtherDetailSection from "./other-detail-section";
import { updateUser } from "./api";

export default function Profile() {
    const { user, userRoles } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [firstname, setFirstname] = useState(user?.firstname || "");
    const [lastname, setLastname] = useState(user?.lastname || "");
    const cencelEdit = () => {
        setFirstname(user?.firstname || "");
        setLastname(user?.lastname || "");
        setIsEditing(false);
    };
    const saveEdit = () => {
        const details = { firstname, lastname };
        console.log("Saving user details:", details);
        updateUser(details);
        setIsEditing(false);
    }
    const toggelEdit = () => {
        if (isEditing) {
            saveEdit();
        } else {
            setFirstname(user?.firstname || "");
            setLastname(user?.lastname || "");
        }
        setIsEditing(!isEditing);
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
            <Nav pages={[{ name: "Home", href: "/" }, { name: "feed", href: "/feed" }]} />
            <br /><br />
            <div className="max-w-6xl mx-auto">
                <section className="relative flex flex-row items-center bg-white rounded-lg shadow-md p-6">
                    <div className="flex gap-1 absolute top-2 right-2">
                        <button
                            onClick={toggelEdit}
                            className="bg-green-500 text-white px-3 py-1 rounded-md"
                        >
                            {isEditing ? "Save" : "Edit"}
                        </button>
                        {isEditing &&
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded-md"
                                onClick={cencelEdit}
                            >
                                Cancel
                            </button>}
                    </div>
                    <div className="flex items-center justify-start">
                        <div className="flex flex-col items-center justify-center">
                            <div className="text-4xl bg-sky-300 rounded-full w-30 h-30 flex items-center justify-center">
                                {user?.username[0].toUpperCase()}
                            </div>
                            <div className="text-lg p-2">@{user?.username}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center pl-6 gap-2">
                        {!isEditing && <h1 className="text-3xl font-bold"> - {user?.firstname} {user?.lastname}</h1>}
                        {isEditing && (
                            <div className="flex flex-row gap-2">
                                <input
                                    type="text"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    className="border rounded-md p-2"
                                />
                                <input
                                    type="text"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    className="border rounded-md p-2"
                                />
                            </div>
                        )}
                        <div className="flex flex-row items-center gap-2">
                            <Mail />
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Phone />
                            <p className="text-gray-600">{user?.phone || "--N/A--"}</p>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            Roles--
                            {
                                userRoles?.map((role) => (
                                    <span key={role} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {role}
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <BioSection />
                <OtherDetailSection />
            </div>
        </div>
    );
}