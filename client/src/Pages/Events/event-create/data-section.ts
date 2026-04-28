export interface EventCreateData {
    organizer_id: string | undefined;
    title: string;
    description: string;
    poster_url: string;
    event_date: string;
    event_time: string;
    venue_id: string | null;
    seat_limit: number;
    category_id: number;
    status: string;
    type: string;
    streaming_link: string;
    is_free: boolean;
    price: number;
}

export interface CreateVenueData {
    name: string;
    address: string;
    city: string;
    capacity: number;
}