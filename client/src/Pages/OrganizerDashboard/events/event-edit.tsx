import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCategoryStore } from "@/store/category";
import { useUserStore } from "@/store/User/user";
import { updateEventDetails, updateVenueDetails, getEventDetails, getVenueDetails } from "./api";
import { toast } from "sonner";

interface Event {
    id: string;
    title: string;
    description: string;
    poster_url: string;
    event_date: string;
    event_time: string;
    venue_id: string;
    seat_limit: number;
    category_id: number;
    status: string;
    type: string;
    streaming_link: string;
    is_free: boolean;
    price: number;
}

interface Venue {
    id: string;
    name: string;
    address: string;
    city: string;
    capacity: number;
}

export default function EventEdit({ event_id }: { event_id: string }) {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string>("Draft");
    const [type, setType] = useState<string>("Online");
    const [categoryId, setCategoryId] = useState<number>(0);
    const [isFree, setIsFree] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [eventDate, setEventDate] = useState<string>("");
    const [eventTime, setEventTime] = useState<string>("");
    const [posterUrl, setPosterUrl] = useState<string>("");
    const [seatLimit, setSeatLimit] = useState<number>(0);
    const [streamingLink, setStreamingLink] = useState<string>("");
    const [price, setPrice] = useState<number>(0);

    const [venueName, setVenueName] = useState<string>("");
    const [venueAddress, setVenueAddress] = useState<string>("");
    const [venueCity, setVenueCity] = useState<string>("");
    const [venueCapacity, setVenueCapacity] = useState<number>(0);
    const [venueId, setVenueId] = useState<string>("");

    const category = useCategoryStore((state) => state.categories);
    const user = useUserStore((state) => state.user);
    const [categoryName, setCategoryName] = useState<string>("");

    useEffect(() => {
        if (category.length === 0) {
            useCategoryStore.getState().fetchCategories();
        }
    }, []);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                const eventResponse = await getEventDetails(event_id);
                const eventData: Event | null = Array.isArray(eventResponse)
                    ? eventResponse[0] ?? null
                    : eventResponse;

                if (!eventData) {
                    toast.error("Event data not found", { position: "top-right" });
                    return;
                }

                // Set event form fields
                setStatus(eventData.status);
                setType(eventData.type);
                setCategoryId(eventData.category_id);
                setIsFree(eventData.is_free);
                setTitle(eventData.title);
                setDescription(eventData.description);
                setEventDate(eventData.event_date);
                setEventTime(eventData.event_time);
                setPosterUrl(eventData.poster_url);
                setSeatLimit(eventData.seat_limit);
                setStreamingLink(eventData.streaming_link);
                setPrice(eventData.price);

                // Fetch venue data
                if (eventData.venue_id) {
                    const venueResponse = await getVenueDetails(eventData.venue_id);
                    const venueData: Venue | null = Array.isArray(venueResponse)
                        ? venueResponse[0] ?? null
                        : venueResponse;

                    if (!venueData) {
                        toast.error("Venue data not found", { position: "top-right" });
                        return;
                    }

                    setVenueId(venueData.id);
                    setVenueName(venueData.name);
                    setVenueAddress(venueData.address);
                    setVenueCity(venueData.city);
                    setVenueCapacity(venueData.capacity);
                }

                // Find and set category name
                const foundCategory = category.find(c => c.id === eventData.category_id);
                if (foundCategory) {
                    setCategoryName(foundCategory.name);
                }
            } catch (error) {
                console.error("Error fetching event data:", error);
                toast.error("Failed to load event data", { position: "top-right" });
            } finally {
                setLoading(false);
            }
        };

        if (event_id) {
            fetchEventData();
        }
    }, [event_id, category]);

    const handleUpdateEvent = async () => {
        try {
            const eventData = {
                organizer_id: user?.id,
                title: title,
                poster_url: posterUrl,
                event_date: eventDate,
                event_time: eventTime,
                description: description,
                venue_id: venueId || null,
                seat_limit: seatLimit,
                category_id: categoryId,
                status: status.toLowerCase(),
                type: type.toLowerCase(),
                streaming_link: streamingLink,
                is_free: isFree,
                price: price
            };

            const result = await updateEventDetails(event_id, eventData);
            if (result.success) {
                toast.success("Event updated successfully!", { position: "top-right" });
            } else {
                toast.error(result.message, { position: "top-right" });
            }
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Failed to update event", { position: "top-right" });
        }
    };

    const handleUpdateVenue = async () => {
        try {
            const venueData = {
                name: venueName,
                address: venueAddress,
                city: venueCity,
                capacity: venueCapacity
            };

            if (!venueId) {
                toast.error("Venue ID is missing", { position: "top-right" });
                return;
            }

            const result = await updateVenueDetails(venueId, venueData);
            if (result.success) {
                toast.success("Venue updated successfully!", { position: "top-right" });
            } else {
                toast.error(result.message, { position: "top-right" });
            }
        } catch (error) {
            console.error("Error updating venue:", error);
            toast.error("Failed to update venue", { position: "top-right" });
        }
    };

    if (loading) {
        return (
            <div>
                <div className="flex justify-center items-center h-screen">
                    <p className="text-lg text-slate-600">Loading event data...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="relative my-10">
                <h1 className="relative text-4xl font-bold text-center mx-auto max-w-2xl p-3 bg-blue-200 rounded-lg shadow-lg shadow-blue-500/50 z-10">Edit Event</h1>
                <div className="absolute top-1/2 left-[5%] h-1 w-[90%] mx-auto bg-blue-500/50 shadow-md shadow-blue-500 z-0"></div>
            </div>
            <div className="mx-auto max-w-6xl space-y-6 p-4">
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">Event Setup</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="status" className="text-sm font-medium text-slate-700">Status</label>
                            <Select value={status}>
                                <SelectTrigger id="status" className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value={"Draft"} onClick={() => setStatus("Draft")}>Draft</SelectItem>
                                        <SelectItem value={"Published"} onClick={() => setStatus("Published")}>Published</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="type" className="text-sm font-medium text-slate-700">Type</label>
                            <Select value={type}>
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Event Type</SelectLabel>
                                        <SelectItem value="Online" onClick={() => setType("Online")}>Online</SelectItem>
                                        <SelectItem value="Physical" onClick={() => setType("Physical")}>Physical</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="is-free" className="text-sm font-medium text-slate-700">Is Free</label>
                            <Select
                                value={isFree ? "true" : "false"}
                                onValueChange={(value) => {
                                    const free = value === "true";
                                    setIsFree(free);
                                    if (free) {
                                        setPrice(0);
                                    }
                                }}
                            >
                                <SelectTrigger id="is-free" className="w-full">
                                    <SelectValue placeholder="Is this event free?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pricing</SelectLabel>
                                        <SelectItem value="true">Yes</SelectItem>
                                        <SelectItem value="false">No</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="category" className="text-sm font-medium text-slate-700">Category</label>
                            <Select value={categoryName}>
                                <SelectTrigger id="category" className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        {
                                            category.map((option, index) => (
                                                <SelectItem key={index} value={String(option.name)} onClick={() => {
                                                    setCategoryId(option.id);
                                                    setCategoryName(option.name);
                                                }}>
                                                    {option.name}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">Event Details</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="title" className="text-sm font-medium text-slate-700">Title</label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter event title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="poster-url" className="text-sm font-medium text-slate-700">Poster URL</label>
                            <Input
                                id="poster-url"
                                type="url"
                                placeholder="https://example.com/poster.jpg"
                                value={posterUrl}
                                onChange={(e) => setPosterUrl(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label htmlFor="description" className="text-sm font-medium text-slate-700">Description</label>
                            <Input
                                id="description"
                                type="text"
                                placeholder="Write a short description of your event"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label htmlFor="streaming-link" className="text-sm font-medium text-slate-700">Stream Link</label>
                            <Input
                                id="streaming-link"
                                type="url"
                                placeholder="https://meet.example.com/room"
                                value={streamingLink}
                                onChange={(e) => setStreamingLink(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">Schedule and Capacity</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="event-time" className="text-sm font-medium text-slate-700">Event Time</label>
                            <Input
                                id="event-time"
                                type="time"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="event-date" className="text-sm font-medium text-slate-700">Event Date</label>
                            <Input
                                id="event-date"
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="price" className="text-sm font-medium text-slate-700">Price</label>
                            <Input
                                id="price"
                                type="number"
                                min={0}
                                placeholder="0"
                                value={price}
                                disabled={isFree}
                                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="seat-limit" className="text-sm font-medium text-slate-700">Seat Limit</label>
                            <Input
                                id="seat-limit"
                                type="number"
                                min={0}
                                placeholder="e.g. 100"
                                value={seatLimit}
                                onChange={(e) => setSeatLimit(Number(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </section>

                <section className="text-center">
                    <button
                        className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg shadow-blue-500/50"
                        onClick={handleUpdateEvent}
                    >
                        Update Event
                    </button>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-800">Venue</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="venue-name" className="text-sm font-medium text-slate-700">Name</label>
                            <Input
                                id="venue-name"
                                type="text"
                                placeholder="Enter venue name"
                                value={venueName}
                                onChange={(e) => setVenueName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="venue-city" className="text-sm font-medium text-slate-700">City</label>
                            <Input
                                id="venue-city"
                                type="text"
                                placeholder="Enter city"
                                value={venueCity}
                                onChange={(e) => setVenueCity(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label htmlFor="venue-address" className="text-sm font-medium text-slate-700">Address</label>
                            <Input
                                id="venue-address"
                                type="text"
                                placeholder="Enter full address"
                                value={venueAddress}
                                onChange={(e) => setVenueAddress(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="venue-capacity" className="text-sm font-medium text-slate-700">Capacity</label>
                            <Input
                                id="venue-capacity"
                                type="number"
                                min={0}
                                placeholder="e.g. 300"
                                value={venueCapacity}
                                onChange={(e) => setVenueCapacity(Number(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </section>

                <section className="text-center">
                    <button
                        className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg shadow-green-500/50"
                        onClick={handleUpdateVenue}
                    >
                        Update Venue
                    </button>
                </section>
            </div>
        </div>
    )
}