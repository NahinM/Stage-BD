import { useParams } from "react-router-dom";

export default function EventPage() {
    const {id} = useParams();

    return (
        <div className="min-h-screen">
            <div className="w-full h-[300px] bg-gradient-to-b from-orange-400/30 to-gray-100 relative">
            <h1 className="absolute top-1/2 left-5 text-3xl font-bold">Welcome to Event {id}</h1>
            <div className="flex flex-row gap-1 absolute bottom-0 translate-y-[50%] left-5 w-[90vw] bg-white p-4 rounded-lg shadow-lg shadow-gray-400">
                <p className="p-2 border-1 border-gray-500 rounded-md">Time: 10:00 AM</p>
                <p className="p-2 border-1 border-gray-500 rounded-md">Location: 123 Main St, Cityville</p>
                <p className="p-2 border-1 border-gray-500 rounded-md">Follower: 100</p>
            </div>
            </div>
            
            <div className="p-3 mt-6">
                <h2 className="text-2xl font-semibold mt-8 mb-4">Event Details</h2>
                <p className="text-lg text-muted-foreground">This is where the event details will be displayed This is where the event details will be displayed This is where the event details will be displayed.</p>
            </div>

            <div className="p-3 mt-6">
                <h2 className="text-2xl font-semibold mt-8 mb-4">Event Organizer</h2>
                <ol>
                    <li className="text-lg text-muted-foreground">John Doe</li>
                    <li className="text-lg text-muted-foreground">Jane Smith</li>
                    <li className="text-lg text-muted-foreground">Bob Johnson</li>
                    <li className="text-lg text-muted-foreground">Alice Williams</li>
                </ol>
            </div>
        </div>
    )
}