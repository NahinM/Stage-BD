import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventDetails, fetchVenueDetails } from "./api";
import type { EventDetails, Venue } from "./event-detail-type";
import { useNavigate } from "react-router-dom";

export default function EventPage() {
    const { id } = useParams();
    const [detail, setDetail] = useState<EventDetails | null>(null);
    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [venueLoading, setVenueLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareSupported, setShareSupported] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setShareSupported(typeof navigator !== "undefined" && !!navigator.share);
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchEventDetails(id)
                .then((data) => {
                    const eventData = data[0] || null;
                    setDetail(eventData);

                    // Fetch venue details if venue_id exists
                    if (eventData?.venue_id) {
                        setVenueLoading(true);
                        fetchVenueDetails(eventData.venue_id)
                            .then((venueData) => setVenue(venueData[0]))
                            .catch((error) => console.error("Error fetching venue:", error))
                            .finally(() => setVenueLoading(false));
                    }
                })
                .catch((error) => console.error("Error fetching event:", error))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Event Page</h1>
                    <p className="mt-3 text-slate-600">Loading event details...</p>
                </div>
            </main>
        );
    }

    if (!detail) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Event Not Found</h1>
                    <p className="mt-3 text-slate-600">The event you're looking for doesn't exist.</p>
                </div>
            </main>
        );
    }

    const formatMoney = (value: number | string) => {
        const amount = typeof value === "number" ? value : Number.parseFloat(value);
        return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "$0.00";
    };

    const formatDate = (value: string | null) => {
        if (!value) return "Not specified";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "Not specified" : date.toLocaleDateString();
    };

    const formatTime = (value: string | null) => {
        if (!value) return "Not specified";
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) return date.toLocaleTimeString();
        return value.length >= 5 ? value.slice(0, 5) : value;
    };

    const isSoldOut = detail.seat_limit !== null && detail.seats_reserved >= detail.seat_limit;
    const seatsLeft = detail.seat_limit !== null ? Math.max(detail.seat_limit - detail.seats_reserved, 0) : 0;
    const shareLink = `${window.location.origin}/event/${detail.id}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: detail.title,
                    text: detail.description,
                    url: shareLink,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Section 1: Title, Description, Type & Status */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-teal-800 to-teal-900 px-6 py-10 text-slate-50 sm:px-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{detail.title}</h1>
                        <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">{detail.description}</p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center rounded-full border border-sky-500/50 bg-sky-700/60 px-3 py-1.5 text-sm font-medium text-white">
                                {detail.type}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-sky-500/50 bg-sky-700/60 px-3 py-1.5 text-sm font-medium text-white">
                                {detail.status}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Section 2: Sharing Section */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-sm p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Share This Event</h2>
                    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">Share link:</p>
                        <p className="break-all font-mono text-sm text-slate-900">{shareLink}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {copied ? "Copied!" : "Copy Link"}
                            </button>
                            {shareSupported && (
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                                >
                                    Share
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Section 3: Event Details */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-sm p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Event Details</h2>
                    <dl className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Event Date</dt>
                            <dd className="mt-2 text-sm font-medium text-slate-900">{formatDate(detail.event_date)}</dd>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Event Time</dt>
                            <dd className="mt-2 text-sm font-medium text-slate-900">{formatTime(detail.event_time)}</dd>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seat Limit</dt>
                            <dd className="mt-2 text-sm font-medium text-slate-900">
                                {detail.seat_limit !== null ? detail.seat_limit : "Unlimited"}
                            </dd>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Streaming Link</dt>
                            <dd className="mt-2 break-all text-sm font-medium text-slate-900">
                                {detail.streaming_link ? (
                                    <a href={detail.streaming_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {detail.streaming_link}
                                    </a>
                                ) : (
                                    "Not provided"
                                )}
                            </dd>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seats Reserved</dt>
                            <dd className="mt-2 text-sm font-medium text-slate-900">{detail.seats_reserved}</dd>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created At</dt>
                            <dd className="mt-2 text-sm font-medium text-slate-900">{formatDate(detail.created_at)}</dd>
                        </div>
                    </dl>
                </section>

                {/* Section 4: Ticketing */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-sm p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Ticketing</h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {detail.is_free ? "Free" : formatMoney(detail.price)}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                {detail.is_free ? "This is a free event" : "Paid entry"}
                            </p>
                            <button
                                type="button" disabled={isSoldOut}
                                className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${isSoldOut ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                                onClick={() => navigate(`/reserve/${detail.id}`)}
                            >
                                Reserve Ticket
                            </button>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</p>
                            <p className={`mt-3 text-3xl font-bold ${isSoldOut ? "text-red-600" : "text-green-600"}`}>
                                {isSoldOut ? "Sold Out" : `${seatsLeft} Seats`}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                {isSoldOut ? "This event is fully booked" : `${seatsLeft} seats remaining`}
                            </p>
                        </div>
                    </div>

                </section>

                {/* Section 5: Venue */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-sm p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Venue Information</h2>
                    {venueLoading ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-sm text-slate-600 animate-pulse">Loading venue information...</p>
                        </div>
                    ) : venue ? (
                        <dl className="grid gap-6 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Venue Name</dt>
                                <dd className="mt-2 text-sm font-medium text-slate-900">{venue.name}</dd>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</dt>
                                <dd className="mt-2 text-sm font-medium text-slate-900">{venue.address}</dd>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">City</dt>
                                <dd className="mt-2 text-sm font-medium text-slate-900">{venue.city}</dd>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capacity</dt>
                                <dd className="mt-2 text-sm font-medium text-slate-900">{venue.capacity}</dd>
                            </div>
                        </dl>
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-sm text-slate-600">No venue information available for this event.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}