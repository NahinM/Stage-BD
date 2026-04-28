import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { EventCardType } from "./event-card-type"
import { useNavigate } from "react-router-dom"

export function EventCard({ Item }: { Item: EventCardType }) {
    const navigate = useNavigate();

    return (
        <Card className="max-w-md p-0 overflow-visible shadow-md shadow-gray-500 hover:shadow-xl transition-shadow duration-300 h-110 w-80 mt-10">
            <CardHeader className="p-0 relative mb-5">
                <div className="w-full h-50 rounded bg-gray-200"></div>
                <div className="absolute flex flex-row bottom-0 right-1 transform translate-y-1/2 gap-1">
                    <div className="border-b-3 border-gray-500 bg-white/80 rounded-md py-1 px-3 font-bold">
                        {(Item.type !== null) ? Item.type : "Waiting"}
                    </div>
                    <div className="border-b-3 border-gray-500 bg-white/80 rounded-md py-1 px-3 font-bold">
                        {Item.is_free ? "Free" : "Paid"}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-center text-lg">{Item.title}</CardTitle>
                <CardDescription className="h-25 overflow-hidden">{Item.description}</CardDescription>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate(`/event/${Item.id}`)}>
                    View Details
                </Button>
            </CardFooter>
        </Card>
    )
}