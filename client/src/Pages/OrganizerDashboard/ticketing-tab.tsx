import {
    BarChart3,
    BadgeDollarSign,
    QrCode,
} from "lucide-react";
import DashboardLink from "./dashboard-link-card";

export default function TicketingTab() {
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">
                Ticketing & Check-in
            </h2>

            <div className="grid gap-3 md:grid-cols-3">
                <DashboardLink
                    to="/organizer-analytics"
                    icon={BarChart3}
                    title="Organizer Analytics"
                    description="Track reservations, check-ins, and performance."
                />

                <DashboardLink
                    to="/checkin"
                    icon={QrCode}
                    title="QR / Manual Check-in"
                    description="Scan code, enter code, or find guest."
                />

                
            </div>
        </div>
    )
}