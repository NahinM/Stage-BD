import Nav from "@/components/nav";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/feed");
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
            <Nav />
            <br /><br />
            <h1>Welcome to the Home Page</h1>
        </div>
    );
}