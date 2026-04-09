export interface EventDetails {
    id: string;
    organizer_id: string;
    title: string;
    description: string;
    poster_url: string;
    event_date: string;
    event_time: string;
    seat_limit: number;
    seats_reserved: number;
    category: string;
    type: string;
    streaming_link: string;
    is_free: boolean;
    price: number;
    status: string;
    created_at: string;
    venue: Venue;
}

interface Venue {
    name: string;
    address: string;
    city: string;
    capacity: number;
}