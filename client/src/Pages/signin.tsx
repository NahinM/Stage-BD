import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SignIn() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = () => {
        const data = {
            username: username,
            password: password
        };
        console.log("Signing in with data:", data);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
            <div className="flex flex-col tems-center gap-4 rounded-lg border bg-background px-0 py-10 text-center shadow-sm">
                <h1 className="text-3xl font-semibold">Sign Into Your Account</h1>
                <div className="p-4 space-y-4 w-3/4 mx-auto mt-8">
                    <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button className="w-20 mx-auto bg-green-600 text-black hover:bg-green-800 hover:text-white mt-4" onClick={handleSignIn}>
                    Sign In
                </Button>
            </div>
        </div>
    )
}