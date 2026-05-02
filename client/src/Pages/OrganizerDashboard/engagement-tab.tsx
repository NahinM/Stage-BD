import { Trophy, Sparkles, Users } from "lucide-react";
import DashboardLink from "./dashboard-link-card";

export default function EngagementTab() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="mb-4 text-xl font-semibold">
                    Audience Engagement
                </h2>

                <div className="grid gap-3 md:grid-cols-2">
                    <DashboardLink
                        to="/organizer/contests"
                        icon={Trophy}
                        title="Contests"
                        description="Run event or community contests."
                    />

                    <DashboardLink
                        to="/recommendations"
                        icon={Sparkles}
                        title="Smart Recommendations"
                        description="Improve discovery and audience matching."
                    />
                </div>
            </div>
        </div>
    )
}