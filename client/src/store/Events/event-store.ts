import {create } from "zustand";
import { type EventCardType } from "@/Pages/Events/event-feed/event-card-type";
import axios from "axios";

interface EventStore {
    events: EventCardType[];
    is_fetching: boolean;
    fetchEvents: () => void;
    setEvents: (events: EventCardType[]) => void;
}

export const useEventStore = create<EventStore>((set) => ({
    events: [] as EventCardType[],
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
    },
    setEvents: (events: EventCardType[]) => {
        set({ events: events, is_fetching: false });
    }
}));

const fetchEvents = useEventStore.getState().fetchEvents;
const setEvents = useEventStore.getState().setEvents;
const events = useEventStore.getState().events;

export { fetchEvents, setEvents, events };