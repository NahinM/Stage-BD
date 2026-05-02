import { HeartHandshake, Palette } from "lucide-react";
import DashboardLink from "./dashboard-link-card";
import { useUserStore } from "@/store/User/user";
import Nav from "@/components/nav";

export default function ArtistPanel() {

    const user = useUserStore((state) => state.user);

    return (
        <div className="p-6">
            <Nav />
            <br /><br />
            <h1 className="p-10 text-center text-xl border border-green-500 bg-green-100 rounded-md m-5">Welcome <span className="text-green-500">{user?.firstname} {user?.lastname}</span>!</h1>
            <h2 className="mb-4 text-xl font-semibold">
                Artist & Sponsor Growth
            </h2>

            <div className="grid gap-3 md:grid-cols-3">
                <DashboardLink
                    to="/artists"
                    icon={Palette}
                    title="Artist Portfolio"
                    description="Showcase artist profile and media."
                />

                <DashboardLink
                    to="/showcase"
                    icon={Palette}
                    title="Digital Art Showcase"
                    description="Display media, art, and performances."
                />

                <DashboardLink
                    to="/sponsors"
                    icon={HeartHandshake}
                    title="Sponsor Matching"
                    description="Connect artists with sponsors and patrons."
                />
                <DashboardLink
                    to="/crowdfunding"
                    icon={HeartHandshake}
                    title="Crowd Funding"
                    description="Raise funds for artistic projects."
                />
            </div>
        </div>
    )
}