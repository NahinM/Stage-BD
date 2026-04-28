import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { Input } from "@/components/ui/input";
import { useState } from "react"
import { allCity, allGender, type SignUpData } from "./data-section";
import { handleSignUp } from "./api";

export default function SignUp() {
    const [userData, setUserData] = useState<SignUpData>({
        username: "",
        firstname: "",
        lastname: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        birthyear: 0,
        gender: "",
        city: "",
    });

    const handleChange = (key: keyof SignUpData, val: string | number) => {
        setUserData((prevData: SignUpData) => ({
            ...prevData,
            [key]: key === "birthyear" ? Number(val) : val
        }));
    };



    return (
        <div className="flex min-h-screen w-full justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
            <div className="flex w-full max-w-3xl flex-col gap-8 rounded-2xl bg-white p-6 shadow-lg shadow-slate-200 md:p-10">
                <h1 className="text-center text-3xl font-bold text-slate-900">Sign Up For Our Service</h1>

                <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-xl font-semibold text-slate-800">User Registration</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="username" className="text-sm font-medium text-slate-700">Username</label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={userData.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="firstname" className="text-sm font-medium text-slate-700">First Name</label>
                            <Input
                                id="firstname"
                                type="text"
                                placeholder="Enter first name"
                                value={userData.firstname}
                                onChange={(e) => handleChange("firstname", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="lastname" className="text-sm font-medium text-slate-700">Last Name</label>
                            <Input
                                id="lastname"
                                type="text"
                                placeholder="Enter last name"
                                value={userData.lastname}
                                onChange={(e) => handleChange("lastname", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                value={userData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</label>
                            <Input
                                id="phone"
                                type="text"
                                placeholder="Enter phone number"
                                value={userData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="birthyear" className="text-sm font-medium text-slate-700">Birth Year</label>
                            <Input
                                id="birthyear"
                                type="number"
                                placeholder="Enter birth year"
                                value={userData.birthyear}
                                onChange={(e) => handleChange("birthyear", e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-xl font-semibold text-slate-800">Password</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={userData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm Password</label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                value={userData.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-xl font-semibold text-slate-800">Personal Detail</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="gender" className="text-sm font-medium text-slate-700">Gender</label>
                            <Select value={userData.gender} onValueChange={(value) => handleChange("gender", value ?? "")}>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Gender</SelectLabel>
                                        {allGender.map((gender) => (
                                            <SelectItem key={gender} value={gender}>
                                                {gender}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="city" className="text-sm font-medium text-slate-700">City</label>
                            <Select value={userData.city} onValueChange={(value) => handleChange("city", value ?? "")}>
                                <SelectTrigger id="city">
                                    <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>City</SelectLabel>
                                        {allCity.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                <section className="flex justify-center">
                    <button
                        className="rounded-md bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700"
                        onClick={() => handleSignUp(userData)}
                    >
                        Sign Up
                    </button>
                </section>
            </div>
        </div>
    )
}