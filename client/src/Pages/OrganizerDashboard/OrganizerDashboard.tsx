import { useMemo, useState } from "react";
import {
  CalendarPlus,
  Ticket,
  QrCode,
  BadgeDollarSign,
  RefreshCcw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsTab from "./events/events-tab";
import TicketingTab from "./ticketing-tab";
import EngagementTab from "./engagement-tab";
import ArtistGrowthTab from "./artist-growth-tab";
import Nav from "@/components/nav";

export default function OrganizerDashboard() {
  const [loading] = useState(false);
  const [error] = useState("");
  const [showActionPanel, setShowActionPanel] = useState(true);

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
      <Nav />
      <br /><br />
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

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="ticketing">Ticketing</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="artist">Artist Growth</TabsTrigger>
          </TabsList>
          <div className="bg-white p-4 rounded-md shadow">
            <TabsContent value="events">
              <EventsTab />
            </TabsContent>
            <TabsContent value="ticketing">
              <TicketingTab />
            </TabsContent>
            <TabsContent value="engagement">
              <EngagementTab />
            </TabsContent>
            <TabsContent value="artist">
              <ArtistGrowthTab />
            </TabsContent>
          </div>
        </Tabs>

      </div>
    </div>
  );
}

