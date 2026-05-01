import { HeartHandshake, Palette } from "lucide-react";
import DashboardLink from "./dashboard-link-card";

export default function ArtistGrowthTab() {
    return (
        <div>
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
            </div>
        </div>
    )
}