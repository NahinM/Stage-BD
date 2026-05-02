import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsTab from "./events/events-tab";
import TicketingTab from "./ticketing-tab";
import EngagementTab from "./engagement-tab";
import Nav from "@/components/nav";
import { useUserStore } from "@/store/User/user";

export default function OrganizerDashboard() {
  const [loading] = useState(false);
  const [error] = useState("");
  const user = useUserStore((state) => state.user);

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
        </div>

        <div className="p-10 mb-5 bg-green-100 rounded-md border border-green-500 text-xl">
          Welcome to Dashboard <span className="text-green-600">{user?.firstname} {user?.lastname}</span>!
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="ticketing">Ticketing</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
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
          </div>
        </Tabs>

      </div>
    </div>
  );
}

