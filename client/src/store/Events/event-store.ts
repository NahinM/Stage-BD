import {create } from "zustand";
import { type EventCardType } from "@/Pages/Events/event-feed/event-card-type";
import axios from "axios";

interface EventStore {
    events: EventCardType[];
    is_fetching: boolean;
    fetchEvents: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
    events: [
        {
            id: "1",
            title: "Tech Conference 2024",
            description: "Join us for a day of tech talks and networking.",
            type: "Conference",
            is_free: false,
            category: "Technology",
        }
    ] as EventCardType[],
    is_fetching: false,
    fetchEvents: () => {
        set({ is_fetching: true });
        axios.get("/api/events")
            .then((response) => {
                set({ events: response.data, is_fetching: false });
            })
            .catch((error) => {
                console.error("Failed to fetch events:", error);
                set({ is_fetching: false });
            });
    }
}));