import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Ticket, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { fetchMyReservations, cancelReservation } from "./api";

type Reservation = {
    id: string;
    reservation_code: string;
    status: "confirmed" | "cancelled" | "attended";
    final_price: number;
    created_at: string;
    event: {
        id: string;
        title: string;
        event_date: string;
        event_time: string;
        poster_url: string;
        venue: { name: string; city: string } | null;
    };
    ticket_slot: { slot_type: string; price: number } | null;
};

export default function MyReservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedQR, setExpandedQR] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState<string | null>(null);

    useEffect(() => {
        fetchMyReservations()
            .then(res => setReservations(res.data.reservations ?? []))
            .catch(() => toast.error("Failed to load reservations"))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = (reservationId: string, eventDate: string) => {
        const eventTime = new Date(eventDate);
        if (eventTime < new Date()) {
            toast.error("Cannot cancel a past event");
            return;
        }
        setCancelling(reservationId);
        cancelReservation(reservationId)
            .then(() => {
                toast.success("Reservation cancelled");
                setReservations(prev =>
                    prev.map(r => r.id === reservationId ? { ...r, status: "cancelled" } : r)
                );
            })
            .catch(err => toast.error(err.response?.data?.message || "Cancel failed"))
            .finally(() => setCancelling(null));
    };

    const statusStyle = (status: string) => {
        if (status === "confirmed") return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
        if (status === "attended") return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
        return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300";
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-muted-foreground animate-pulse">Loading your reservations...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/30 py-10 px-4">
            <div className="mx-auto max-w-2xl space-y-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">My Reservations</h1>
                    <Button variant="outline" onClick={() => navigate("/")}>Back to home</Button>
                </div>

                {reservations.length === 0 && (
                    <div className="rounded-xl border bg-background shadow-sm p-12 text-center space-y-3">
                        <Ticket className="mx-auto text-muted-foreground" size={40} />
                        <p className="text-muted-foreground">You have no reservations yet.</p>
                        <Button
                            className="bg-green-600 text-black hover:bg-green-800 hover:text-white"
                            onClick={() => navigate("/")}
                        >
                            Browse events
                        </Button>
                    </div>
                )}

                {reservations.map(r => (
                    <div key={r.id} className="rounded-xl border bg-background shadow-sm overflow-hidden">

                        {/* Event poster strip */}
                        {r.event.poster_url && (
                            <img
                                src={r.event.poster_url}
                                alt={r.event.title}
                                className="w-full h-32 object-cover"
                            />
                        )}

                        <div className="p-6 space-y-4">

                            {/* Header row */}
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h2 className="font-semibold text-lg leading-tight">{r.event.title}</h2>
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays size={13} />
                                            {new Date(r.event.event_date).toDateString()} {r.event.event_time?.slice(0, 5)}
                                        </span>
                                        {r.event.venue && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={13} />
                                                {r.event.venue.name}, {r.event.venue.city}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize shrink-0 ${statusStyle(r.status)}`}>
                                    {r.status}
                                </span>
                            </div>

                            {/* Ticket info */}
                            <div className="flex items-center justify-between text-sm border rounded-lg px-4 py-3 bg-muted/40">
                                <div>
                                    <p className="text-muted-foreground text-xs">Ticket type</p>
                                    <p className="font-medium capitalize">{r.ticket_slot?.slot_type?.replace("_", " ") ?? "Standard"}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-muted-foreground text-xs">Paid</p>
                                    <p className="font-medium text-green-600">
                                        {r.final_price === 0 ? "Free" : `৳${r.final_price}`}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-muted-foreground text-xs">Code</p>
                                    <p className="font-mono font-bold text-green-600 tracking-wider">{r.reservation_code}</p>
                                </div>
                            </div>

                            {/* QR toggle — only for confirmed/attended */}
                            {(r.status === "confirmed" || r.status === "attended") && (
                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setExpandedQR(expandedQR === r.id ? null : r.id)}
                                    >
                                        {expandedQR === r.id ? "Hide QR code" : "Show QR code"}
                                    </Button>

                                    {expandedQR === r.id && (
                                        <div className="flex flex-col items-center gap-3 py-4 border rounded-xl bg-white">
                                            <QRCodeSVG
                                                value={r.reservation_code}
                                                size={200}
                                                includeMargin
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Scan at the venue entrance
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Cancel button */}
                            {r.status === "confirmed" && (
                                <Button
                                    variant="outline"
                                    className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handleCancel(r.id, r.event.event_date)}
                                    disabled={cancelling === r.id}
                                >
                                    <XCircle size={15} className="mr-2" />
                                    {cancelling === r.id ? "Cancelling..." : "Cancel reservation"}
                                </Button>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}