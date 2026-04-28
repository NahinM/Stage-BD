import Nav from "@/components/nav";
export default function Home() {

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
            <Nav pages={[
                { name: "Home", href: "/" },
                { name: "Feed", href: "/feed" }
            ]} />
            <br /><br />
            <h1>Welcome to the Home Page</h1>
        </div>
    );
}