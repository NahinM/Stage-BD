import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarPlus,
  Ticket,
  QrCode,
  Megaphone,
  Trophy,
  Sparkles,
  Palette,
  HeartHandshake,
  BadgeDollarSign,
  Share2,
  Search,
  Users,
  RefreshCcw,
} from "lucide-react";

type Mode = "events" | "ticketing" | "engagement" | "artist";

export default function OrganizerDashboard() {
  const [loading] = useState(false);
  const [error] = useState("");
  const [showActionPanel, setShowActionPanel] = useState(true);
  const [mode, setMode] = useState<Mode>("events");

  const stats = useMemo(
    () => [
      {
        label: "Total Events",
        value: "12",
        icon: CalendarPlus,
      },
      {
        label: "Reservations",
        value: "348",
        icon: Ticket,
      },
      {
        label: "Checked In",
        value: "219",
        icon: QrCode,
      },
      {
        label: "Promo Uses",
        value: "74",
        icon: BadgeDollarSign,
      },
    ],
    []
  );

  if (loading) {
    return <div className="p-8 text-lg font-medium">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Organizer Dashboard
            </h1>
            <p className="mt-1 text-gray-500">
              Manage events, tickets, QR check-in, promo codes, contests, artists, sponsors, and analytics.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowActionPanel((prev) => !prev)}
              className="rounded-xl bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
            >
              {showActionPanel ? "Close Tools" : "Open Tools"}
            </button>

            <button className="rounded-xl bg-black px-4 py-2 text-white shadow hover:opacity-90">
              <RefreshCcw className="mr-2 inline h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <h2 className="mt-2 text-4xl font-bold text-green-600">
                  {stat.value}
                </h2>
              </div>
            );
          })}
        </div>

        {showActionPanel && (
          <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap gap-3">
              <button
                onClick={() => setMode("events")}
                className={`rounded-xl px-4 py-2 ${
                  mode === "events"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Events
              </button>

              <button
                onClick={() => setMode("ticketing")}
                className={`rounded-xl px-4 py-2 ${
                  mode === "ticketing"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Ticketing
              </button>

              <button
                onClick={() => setMode("engagement")}
                className={`rounded-xl px-4 py-2 ${
                  mode === "engagement"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Engagement
              </button>

              <button
                onClick={() => setMode("artist")}
                className={`rounded-xl px-4 py-2 ${
                  mode === "artist"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Artist Growth
              </button>
            </div>

            {mode === "events" && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  Event Management
                </h2>

                <div className="grid gap-3 md:grid-cols-3">
                  <DashboardLink
                    to="/event/create"
                    icon={CalendarPlus}
                    title="Create Event"
                    description="Create physical or online events."
                  />

                  <DashboardLink
                    to="/feed"
                    icon={Search}
                    title="Event Discovery Feed"
                    description="See how events appear to users."
                  />

                  
                </div>
              </div>
            )}

            {mode === "ticketing" && (
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

                  <DashboardLink
                    to="/organizer/promos"
                    icon={BadgeDollarSign}
                    title="Promo Codes"
                    description="Create discounts and track usage."
                  />
                </div>
              </div>
            )}

            {mode === "engagement" && (
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
            )}

            {mode === "artist" && (
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
            )}
          </div>
        )}

        
      </div>
    </div>
  );
}

function DashboardLink({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string;
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border bg-gray-50 p-4 transition hover:border-green-500 hover:bg-green-50"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white">
        <Icon className="h-5 w-5 text-green-600" />
      </div>

      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}