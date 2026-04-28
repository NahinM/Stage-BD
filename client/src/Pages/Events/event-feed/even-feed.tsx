import { useEventStore } from "@/store/Events/event-store";
import { EventCard } from "./event-card"
import { type EventCardType } from "./event-card-type"
import { useEffect } from "react";
import Nav from "@/components/nav";
import EventSearchBox from "./search-filter/search";

export default function EventFeed() {
    const events = useEventStore((state) => state.events);

    useEffect(() => {
        if (events.length === 0) {
            useEventStore.getState().fetchEvents();
        }
    }, [])

    return (
        <div className="bg-muted min-h-screen p-4 w-full">
            <Nav pages={[
                { name: "Home", href: "/" },
                { name: "Feed", href: "/feed" }
            ]} />
            <br /><br />

            <h1 className="text-2xl font-bold mb-4 text-center">Event Feed</h1>

            <EventSearchBox />
            <div className="flex flex-wrap gap-8 min-h-screen">
                {
                    events.map((event: EventCardType) => (
                        <EventCard key={event.id} Item={event} />
                    ))
                }
            </div>
        </div>
    )
}