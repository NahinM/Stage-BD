import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {handleSigninAPI} from "./api";
import { useNavigate } from "react-router-dom";

export default function SignIn() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const navigate = useNavigate();

    const handleSigninClick = async () => {
        if (!username || !password) {
            toast.error("Please enter both username and password.");
            return;
        }
        const isSignedIn = await handleSigninAPI(username, password);
        if (!isSignedIn) {
            toast.error("Invalid username or password.");
        } else {
            toast.success("Sign-in successful!");
            navigate("/profile");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
            <div className="flex flex-col tems-center gap-4 rounded-lg border bg-background px-6 py-10 text-center shadow-sm">
                <h1 className="text-3xl font-semibold">Sign In to Your Account</h1>
                <div className="p-2 space-y-4 mx-auto mt-8">
                    <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <div className="flex items-center relative">
                        <Input type={hidePassword ? "password" : "text"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {!hidePassword && <Eye className="ml-2 cursor-pointer" onClick={() => setHidePassword(!hidePassword)} />}
                        {hidePassword && <EyeClosed className="ml-2 cursor-pointer" onClick={() => setHidePassword(!hidePassword)} />}
                    </div>
                </div>
                <Button className="w-20 mx-auto bg-green-600 text-black hover:bg-green-800 hover:text-white mt-4" onClick={handleSigninClick}>
                    Sign In
                </Button>
            </div>
        </div>
    )
}