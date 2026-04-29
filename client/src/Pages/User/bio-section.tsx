import { useState } from "react";
import { useUserStore } from "@/store/User/user";
import { updateUser } from "./api";
export function BioSection() {
    const { user } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newBio, setNewBio] = useState(user?.bio || "");

    const cencelEdit = () => {
        setNewBio(user?.bio || "");
        setIsEditing(false);
    };

    const saveEdit = async () => {
        if (!user) return;
        try {
            await updateUser({ bio: newBio });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user bio:", error);
        }
    };

    return (
        <section className="relative w-full border shadow-md p-1 mt-2 bg-white rounded-lg">
            <div className="flex gap-1 absolute top-2 right-2">
                <button
                    onClick={() => { setIsEditing(!isEditing); if (isEditing) saveEdit(); }}
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
            <h1 className="text-xl font-bold py-2 px-4">Bio</h1>
            {isEditing ? (
                <textarea
                    className="border min-h-20 rounded-md p-2 w-full"
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                />
            ) : (
                <p className="border min-h-20 rounded-md p-2">{user?.bio || "--N/A--"}</p>
            )}
        </section>
    )
}