import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {fetchEventDetails} from "./api";
import type { EventDetails } from "./event-detail-type";

export default function EventPage() {
    const { id } = useParams();
    const [detail, setDetail] = useState<EventDetails | null>(null);
    useEffect(() => {
        if (id) {
            fetchEventDetails(id).then(data => {
                setDetail(data);
            });
        }
    },[id]);
    return (
        <div>
            <h1>Event Page</h1>
            {detail && (
                <div>
                    <h2>{detail.title}</h2>
                    <p>{detail.description}</p>
                    <p>Event Date: {detail.event_date}</p>
                    <p>Event Time: {detail.event_time}</p>
                    <p>Seat Limit: {detail.seat_limit}</p>
                    <p>Seats Reserved: {detail.seats_reserved}</p>
                    <p>Category: {detail.category}</p>
                    <p>Type: {detail.type}</p>
                    <p>Streaming Link: {detail.streaming_link}</p>
                    <p>Is Free: {detail.is_free.toString()}</p>
                    <p>Price: ${detail.price.toFixed(2)}</p>
                    <p>Status: {detail.status}</p>
                    <p>Created At: {detail.created_at}</p>
                    <h3>Venue</h3>
                    <p>Name: {detail.venue.name}</p>
                    <p>Address: {detail.venue.address}</p>
                    <p>City: {detail.venue.city}</p>
                    <p>Capacity: {detail.venue.capacity}</p>
                </div>
            )}
        </div>
    )
}