import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react"
import { validateSignUpData } from "./validation";
import { toast } from "sonner";

export default function SignUp() {
    const [data, setData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        birthYear: "",
        gender: ""
    });

    const handleChange = (key:string, val:string | Number) => {
        setData(prevData => ({
            ...prevData,
            [key]: key === "birthYear" ? Number(val) : val
        }));
    };

    const handleSignUp = () => {
        
        if (data.password !== data.confirmPassword) {toast.error("Confirm Password: Passwords do not match"); return; }
        const validationResult = validateSignUpData(data);
        if (!validationResult.success) {
            const err = validationResult.error.format();
            if (err.gender) {toast.error("Gender: " + err.gender._errors.join(", ")); return;}
            if (err.username) {toast.error("Username: " + err.username._errors.join(", ")); return;}
            if (err.password) {toast.error("Password: " + err.password._errors.join(", ")); return;}
            if (err.email) {toast.error("Email: " + err.email._errors.join(", ")); return;}
            if (err.phone) {toast.error("Phone: " + err.phone._errors.join(", ")); return;}
            if (err.birthYear) {toast.error("Birth Year: " + err.birthYear._errors.join(", ")); return;}
            return;
        }

        axios.post("/api/signup", data).then(response => {
            toast.success(response.data.message);
        }).catch(error => {
            toast.error("Sign-up failed: " + (error.response?.data?.message || error.message));
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
            <div className="flex flex-col tems-center gap-4 rounded-lg border bg-background px-6 py-10 text-center shadow-sm">
                <h1 className="text-3xl font-semibold">Sign Up for an Account</h1>
                <div className="p-2 space-y-4 mx-auto mt-8 flex flex-col">
                    <div>
                        <h2 className="text-left">Username:</h2>
                        <Input id="username" type="text" name="username" placeholder="Username" value={data.username} onChange={(e) => handleChange("username", e.target.value)} />
                    </div>
                    <div>
                        <h2 className="text-left">Password:</h2>
                        <Input id="password" type="password" name="password" placeholder="Password" value={data.password} onChange={(e) => handleChange("password", e.target.value)} />
                    </div>
                    <div>
                        <h2 className="text-left">Confirm Password:</h2>
                        <Input id="confirmPassword" type="password" name="confirmPassword" placeholder="Confirm Password" value={data.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} />
                    </div>
                    <div>
                        <h2 className="text-left">Email:</h2>
                        <Input id="email" type="email" name="email" placeholder="Email" value={data.email} onChange={(e) => handleChange("email", e.target.value)} />
                    </div>
                    <div>
                        <h2 className="text-left">Phone Number:</h2>
                        <Input id="phone" type="text" name="phone" placeholder="Phone Number" value={data.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                    </div>
                    <div>
                        <h2 className="text-left">Birth Year:</h2>
                        <Input id="birthYear" type="number" name="birthYear" placeholder="Birth Year" value={data.birthYear} onChange={(e) => handleChange("birthYear", e.target.value)} />
                    </div>
                    <div>
                        <h2 className="text-left">Gender:</h2>
                        <select id="gender" name="gender" value={data.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <button
                className="w-20 mx-auto bg-green-600 text-black hover:bg-green-800 hover:text-white mt-4 rounded-md px-2 py-2"
                onClick={handleSignUp}>
                    Sign Up
                </button>
            </div>
        </div>
    )
}