import { CalendarPlus, Search } from "lucide-react";
import DashboardLink from "../dashboard-link-card";
import EventCard, { type EventItem } from "./event-card";
import axios from "axios";
import { useEffect } from "react";
import { useUserStore, refreshUserIfNeeded } from "@/store/User/user";

import { create } from "zustand";
interface MyEventsState {
    myEvents: EventItem[];
    setMyEvents: (events: EventItem[]) => void;
    getMyEvents: (user: any) => Promise<void>; // Add this line for the getter function
}
const useMyEventsStore = create<MyEventsState>((set) => ({
    myEvents: [],
    setMyEvents: (events) => set({ myEvents: events }),
    getMyEvents: async (user) => {
        try {
            if (user?.id) {
                await refreshUserIfNeeded()
                console.log("Current user in EventsTab: ", user.id);
                const query = {
                    columns: "id, title, description, is_free, type, category_id, status, venue_id",
                    search: { by: 'organizer', value: user.id },
                    filter: { category_id: null, is_free: null, type: null, status: null },
                };
                console.log("Fetching events with query: ", query);
                axios.get("/api/event", {
                    params: {
                        query: JSON.stringify(query)
                    }
                }).then((res) => {
                    useMyEventsStore.getState().setMyEvents(res.data);
                });
            }

        } catch (err) {
            console.error("Error fetching events: ", err);
        }
    }, // Implement the getter function
}));

export default function EventsTab() {

    const myEvents = useMyEventsStore((state) => state.myEvents);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        (async () => {
            await useMyEventsStore.getState().getMyEvents(user);
        })()
    }, [user]);
    return (
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
            <h1 className="mt-6 text-xl font-bold border-t pt-4">
                My Events
            </h1>
            <div className="mt-4 flex flex-row flex-wrap gap-4">
                {myEvents.map((event: EventItem) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    )
}