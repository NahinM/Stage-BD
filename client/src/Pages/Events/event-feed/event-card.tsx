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

export function EventCard({Item}: {Item: EventCardType}) {
    return (
        <Card className="max-w-md p-0 overflow-visible shadow-md shadow-gray-500 hover:shadow-xl transition-shadow duration-300 h-110 mt-10">
            <CardHeader className="p-0 relative mb-5">
                <div className="w-full h-50 rounded bg-gray-200"></div>
                <div className="absolute top-0 left-0 bg-white/80 rounded-md py-1 px-3 transform -translate-y-full font-bold border-t-3 border-gray-500">
                    {Item.is_free ? "Free" : "Paid"}
                </div>
                <div className="absolute bottom-0 right-0 bg-white/80 rounded-md py-1 px-3 font-bold transform translate-y-1/2 border-b-3 border-gray-500">
                    {Item.type}
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-center text-lg">{Item.title}</CardTitle>
                <CardDescription className="h-25">{Item.description}</CardDescription>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">
                    View Details
                </Button>
            </CardFooter>
        </Card>
    )
}