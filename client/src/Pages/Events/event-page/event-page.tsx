import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {fetchEventDetails} from "./api";
import type { EventDetails } from "./event-detail-type";

export default function EventPage() {
    const { id } = useParams();
    const [detail, setDetail] = useState<EventDetails | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEventDetails(id).then(data => {
                setDetail(data);
            });
        }
    },[id]);

    if (!detail) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Event Page</h1>
                    <p className="mt-3 text-slate-600">Loading event details...</p>
                </div>
            </main>
        );
    }

    const formatMoney = (value: number) => `$${value.toFixed(2)}`;
    const isSoldOut = detail.seat_limit > 0 && detail.seats_reserved >= detail.seat_limit;
    const seatsLeft = Math.max(detail.seat_limit - detail.seats_reserved, 0);
    const shareLink = `http://localhost:5173/event/${detail.id}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    };

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#e2e8f0_45%,_#cbd5e1_100%)] px-4 py-10 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white/85 shadow-2xl backdrop-blur-sm">
                <div className="border-b border-slate-200 bg-slate-900 px-6 py-8 text-slate-50 sm:px-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Event Page</p>
                    <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{detail.title}</h1>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">{detail.description}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full border border-slate-500/50 bg-slate-700/60 px-3 py-1 font-medium">
                            {detail.status}
                        </span>
                        <span className="rounded-full border border-slate-500/50 bg-slate-700/60 px-3 py-1 font-medium">
                            {detail.category}
                        </span>
                        <span className="rounded-full border border-slate-500/50 bg-slate-700/60 px-3 py-1 font-medium">
                            {detail.type}
                        </span>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-700/70 bg-slate-800/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sharing Link</p>
                            <p className="mt-2 break-all text-sm text-slate-100">{shareLink}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                            {copied ? "Copied" : "Copy link"}
                        </button>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                        {copied ? "Link copied to clipboard." : "Click the button to copy the link."}
                    </div>
                </div>

                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-3 lg:p-10">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                        <h2 className="text-lg font-semibold text-slate-900">Event Details</h2>
                        <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Event Date</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-900">{detail.event_date}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Event Time</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-900">{detail.event_time}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seat Limit</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-900">{detail.seat_limit}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seats Reserved</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-900">{detail.seats_reserved}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created At</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-900">{detail.created_at}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Streaming Link</dt>
                                <dd className="mt-1 break-all text-sm font-medium text-slate-900">
                                    {detail.streaming_link || "Not provided"}
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <aside className="space-y-6">
                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Ticketing</h2>
                            <div className="mt-4 space-y-3">
                                <p className="text-sm text-slate-600">{detail.is_free ? "This is a free event." : "Paid entry required."}</p>
                                <p className="text-2xl font-semibold text-slate-900">{detail.is_free ? "Free" : formatMoney(detail.price)}</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {isSoldOut ? "Sold out" : `${seatsLeft} seats left`}
                                </p>
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Venue</h2>
                            {detail.venue ? (
                                <dl className="mt-4 space-y-3">
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</dt>
                                        <dd className="mt-1 text-sm font-medium text-slate-900">{detail.venue.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</dt>
                                        <dd className="mt-1 text-sm font-medium text-slate-900">{detail.venue.address}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">City</dt>
                                        <dd className="mt-1 text-sm font-medium text-slate-900">{detail.venue.city}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capacity</dt>
                                        <dd className="mt-1 text-sm font-medium text-slate-900">{detail.venue.capacity}</dd>
                                    </div>
                                </dl>
                            ) : (
                                <p className="mt-4 text-sm text-slate-600">No venue information available.</p>
                            )}
                        </article>
                    </aside>
                </div>
            </section>
        </main>
    );
}