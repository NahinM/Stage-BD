import { Trophy, Sparkles, Users } from "lucide-react";
import DashboardLink from "./dashboard-link-card";

export default function EngagementTab() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="mb-4 text-xl font-semibold">
                    Audience Engagement
                </h2>

                <div className="grid gap-3 md:grid-cols-3">
                    <DashboardLink
                        to="/organizer/contests"
                        icon={Trophy}
                        title="Contests"
                        description="Run event or community contests."
                    />

                    <DashboardLink
                        to="/events"
                        icon={Sparkles}
                        title="Smart Recommendations"
                        description="Improve discovery and audience matching."
                    />

                    <DashboardLink
                        to="/community"
                        icon={Users}
                        title="Community Contests"
                        description="Engage users with public competitions."
                    />
                </div>
            </div>
        </div>
    )
}