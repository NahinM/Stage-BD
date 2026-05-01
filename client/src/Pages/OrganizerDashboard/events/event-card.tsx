import { useCategoryStore } from "@/store/category";
import { Edit } from "lucide-react"

interface EventItem {
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
    return (
        <div className="relative rounded-lg border p-4 w-70 mt-4 shadow-md shadow-gray-400 hover:shadow-lg transition">
            <span className="absolute top-0 left-0 bg-white text-md font-bold px-3 py-1 rounded-md border border-gray-300 transform translate-x-3 -translate-y-1/2">
                {event.status}
            </span>
            <br />
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="mt-2 text-gray-700">{event.description}</p>
            <div className="mt-3 flex items-center gap-2 text-sm min-h-20">
                {
                    [category?.name, event.is_free ? "Free" : null, event.type].filter(Boolean).map((tag) => (
                        <span key={tag} className="bg-sky-200 px-2 py-1 rounded-full">
                            {tag}
                        </span>
                    ))
                }
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-1 px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-md shadow-green-300 transition">
                <Edit className="inline-block scale-70" />
                Edit Event
            </button>
        </div>
    )
}