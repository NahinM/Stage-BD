import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const eventData = [
    {
        id: 1,
        title: "Event 1",
        description: "This is the first event.",
    },
    {
        id: 2,
        title: "Event 2",
        description: "This is the second event.",
    },
    {
        id: 3,
        title: "Event 3",
        description: "This is the third event.",
    },
    {
        id: 4,
        title: "Event 4",
        description: "This is the fourth event.",
    },
    {
        id: 5,
        title: "Event 5",
        description: "This is the fifth event.",
    }
]

export default function EventFeed() {
    return (
        <div className="bg-muted/30 min-h-screen p-2">
            <h1 className="text-3xl font-semibold">Event Feed</h1>
            <p className="text-lg text-center text-muted-foreground">This is where the event feed will be displayed.</p>
            <div className="flex flex-row flex-wrap gap-4 p-4">
                {eventData.map((event) => (
                    <Card 
                    key={event.id}
                    className="w-[300px] min-h-[300px] border bg-background shadow-xl hover:shadow-gray-800 hover:translate-y-[-10px] transition-all duration-300 p-0 pb-4 cursor-pointer"
                    >
                        <div className="mt-0 w-full top-0 min-h-[200px] flex items-center justify-center bg-gray-200 text-gray-500">
                            image
                        </div>
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{event.description}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}