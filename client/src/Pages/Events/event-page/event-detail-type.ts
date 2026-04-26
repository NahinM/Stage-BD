export interface EventDetails {
    id: string;
    organizer_id: string;
    title: string;
    description: string;
    poster_url: string | null;
    event_date: string | null;
    event_time: string | null;
    seat_limit: number | null;
    seats_reserved: number;
    category_id: number | null;
    type: string;
    streaming_link: string | null;
    is_free: boolean;
    price: number | string;
    status: string;
    created_at: string;
    venue_id: string | null;
}

export interface Venue {
    id: string;
    name: string;
    address: string;
    city: string;
    capacity: number;
}