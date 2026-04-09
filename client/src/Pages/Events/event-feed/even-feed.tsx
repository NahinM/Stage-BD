import { events } from "./api"
import { EventCard } from "./event-card"

export default function EventFeed() {
    return (
        <div className="bg-muted/70 min-h-screen p-4 w-full">
            <h1 className="text-2xl font-bold mb-4 text-center">Event Feed</h1>
            <div className="flex flex-wrap gap-2">
                {
                    events.map((event) => (
                        <EventCard key={event.id} Item={event} />
                    ))
                }
            </div>
        </div>
    )
}