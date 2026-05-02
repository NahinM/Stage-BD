import { useCategoryStore } from "@/store/category";
import { Edit, QrCode, User, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import EventEdit from "./event-edit";

export interface EventItem {
    id: string;
    status: "Draft" | "Published";
    title: string;
    description: string;
    is_free: boolean;
    type: string;
    category_id: number;
}

export default function EventCard({ event }: { event: EventItem }) {
    const categories = useCategoryStore((state) => state.categories);
    const category = categories.find((cat) => cat.id === event.category_id);
    useEffect(() => {
        if (!category) {
            useCategoryStore.getState().fetchCategories();
        }
    }, []);
    return (
        <div className="relative rounded-lg border p-4 w-70 mt-4 bg-gray-100/50 hover:bg-green-100/20 hover:border-green-500 shadow transition">
            <span className="absolute top-0 left-0 bg-white text-md font-bold px-3 py-1 rounded-md border border-gray-300 transform translate-x-3 -translate-y-1/2">
                {event.status}
            </span>
            <br />
            <div className="min-h-[120px]">
                <h3 className="text-lg text-center font-semibold">{event.title}</h3>
                <p className="mt-2 text-gray-700">{event.description}</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
                {
                    [category?.name, event.is_free ? "Free" : "Paid", event.type].filter(Boolean).map((tag) => (
                        <span key={tag} className="bg-sky-300/20 px-2 py-1 rounded-md border border-sky-500">
                            {tag}
                        </span>
                    ))
                }
            </div>
            <div className="mt-4 flex flex-row">
                {/* Edit */}
                <Dialog>
                    <DialogTrigger className="w-full flex items-center justify-center gap-1 py-1 bg-green-700 text-white rounded-l-md hover:bg-green-800">
                        <Edit size={15} /> Edit
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-5xl overflow-y-auto h-9/10">
                        <EventEdit event_id={event.id} />
                    </DialogContent>
                </Dialog>

                {/* Waitlist */}
                <Link
                    to={`/organizer/waitlist/${event.id}`}
                    className="w-full flex items-center justify-center gap-1 py-1 bg-yellow-700 text-white hover:bg-yellow-800"
                >
                    <Edit size={14} /> Wait List
                </Link>

                {/* Check-in */}
                <Link
                    to={`/checkin/${event.id}`}
                    className="w-full flex items-center justify-center gap-1 py-1 bg-blue-700 text-white hover:bg-blue-800"
                >
                    <QrCode size={14} /> Check-in
                </Link>

                {/* Delete */}
                <Dialog>
                    <DialogTrigger className="w-full flex items-center justify-center gap-1 py-1 bg-red-700 text-white rounded-r-md hover:bg-red-800">
                        <Trash2 size={14} /> Delete
                    </DialogTrigger>
                    <DialogContent>
                        <div className="flex flex-col items-center justify-center gap-4">
                            <h1 className="p-3 text-lg font-bold">Do you want to delete this event?</h1>
                            <p>Event Title: <span className="font-semibold">{event.title}</span></p>
                            <Button className="bg-red-700 hover:bg-red-800">Delete</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}