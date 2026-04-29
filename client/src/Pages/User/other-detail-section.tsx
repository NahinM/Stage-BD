import { useState } from "react";
import { useUserStore } from "@/store/User/user";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const allCity: string[] = [
    "Barishal",
    "Bogra",
    "Chattogram",
    "Cumilla",
    "Dhaka",
    "Gazipur",
    "Khulna",
    "Mymensingh",
    "Narayanganj",
    "Rajshahi",
    "Rangpur",
    "Sylhet",
];

const allGender: string[] = ["Male", "Female", "Other"];

export default function OtherDetailSection() {
    const { user } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);

    const [birthyear, setBirthyear] = useState(user?.birthyear || new Date().getFullYear());
    const [gender, setGender] = useState(user?.gender || "");
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
    const [city, setCity] = useState(user?.city || "");

    const cencelEdit = () => {
        setBirthyear(user?.birthyear || new Date().getFullYear());
        setGender(user?.gender || "");
        setAvatarUrl(user?.avatar_url || "");
        setCity(user?.city || "");
        setIsEditing(false);
    }
    return (
        <section className="relative w-full border shadow-md p-1 mt-2 bg-white rounded-lg">
            <div className="flex gap-1 absolute top-2 right-2">
                <button
                    onClick={() => setIsEditing(!isEditing)}
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
            <h1 className="text-xl font-bold py-2 px-4">Other Details</h1>
            <div className="px-4 pb-4 space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Birth Year</label>
                    {isEditing ? (
                        <input
                            type="number"
                            className="border rounded-md p-2 w-full"
                            value={birthyear}
                            onChange={(e) => setBirthyear(Number(e.target.value))}
                        />
                    ) : (
                        <p className="border rounded-md p-2">{birthyear || "--N/A--"}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    {isEditing ? (
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {allGender.map((g) => (
                                        <SelectItem key={g} value={g}>
                                            {g}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    ) : (
                        <p className="border rounded-md p-2">{gender || "--N/A--"}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    {isEditing ? (
                        <Select value={city} onValueChange={setCity}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {allCity.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    ) : (
                        <p className="border rounded-md p-2">{city || "--N/A--"}</p>
                    )}
                </div>
                {isEditing && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Avatar URL</label>
                        <input
                            type="text"
                            className="border rounded-md p-2 w-full"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}