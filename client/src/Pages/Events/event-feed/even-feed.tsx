import { useEventStore } from "@/store/Events/event-store";
import { EventCard } from "./event-card"
import {type EventCardType} from "./event-card-type"

export default function EventFeed() {
    const events = useEventStore((state) => state.events);

    return (
        <div className="bg-muted min-h-screen p-4 w-full">
            <h1 className="text-2xl font-bold mb-4 text-center">Event Feed</h1>
            <div className="flex flex-wrap gap-2 min-h-screen">
                {
                    events.map((event: EventCardType) => (
                        <EventCard key={event.id} Item={event} />
                    ))
                }
            </div>
        </div>
    )
}