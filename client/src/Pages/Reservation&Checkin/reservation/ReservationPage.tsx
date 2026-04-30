import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, MapPin, Tag, Ticket, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchEventDetails, applyPromo, makeReservation } from "./api";
import { useUserStore, userLogout, refreshUserIfNeeded } from "@/store/User/user";
export default function ReservationPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState<any>(null);
    const [slots, setSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [promoInput, setPromoInput] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const seatsLeft = event ? event.seat_limit - event.seats_reserved : 0;
    const basePrice = selectedSlot?.price ?? event?.price ?? 0;
    const discount = appliedPromo ? (basePrice * appliedPromo.discount_percent) / 100 : 0;
    const finalPrice = Math.max(0, basePrice - discount);

    useEffect(() => {
        if (!eventId) return;
        fetchEventDetails(eventId)
            .then(res => {
                setEvent(res.data.event);
                setSlots(res.data.slots ?? []);
                if (res.data.slots?.length > 0) setSelectedSlot(res.data.slots[0]);
            })
            .catch(() => toast.error("Failed to load event"))
            .finally(() => setLoading(false));
    }, [eventId]);

    useEffect(() => {
        (async () => {
            await refreshUserIfNeeded();
        })();
    }, []);

    const handleApplyPromo = () => {
        if (!promoInput.trim()) return;
        applyPromo(eventId!, promoInput.trim())
            .then(res => {
                setAppliedPromo(res.data.promo);
                toast.success(`Promo applied! ${res.data.promo.discount_percent}% off`);
            })
            .catch(() => toast.error("Invalid or expired promo code"));
    };

    const handleReserve = () => {
        if (!selectedSlot) return toast.error("Please select a ticket type");
        setSubmitting(true);
        makeReservation({
            eventId: eventId!,
            slotId: selectedSlot.id,
            promoCodeId: appliedPromo?.id,
            finalPrice,
        })
            .then(res => {
                toast.success("Reservation confirmed!");
                navigate(`/reservation/success/${res.data.reservation.reservation_code}`);
            })
            .catch(err => toast.error(err.response?.data?.message || "Reservation failed"))
            .finally(() => setSubmitting(false));
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-muted-foreground animate-pulse">Loading event...</p>
        </div>
    );

    if (!event) return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-destructive">Event not found.</p>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-muted/30 py-10 px-4">
            <div className="mx-auto w-full max-w-2xl space-y-6">

                {/* Event card */}
                <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
                    {event.poster_url && (
                        <img src={event.poster_url} alt={event.title} className="w-full h-52 object-cover" />
                    )}
                    <div className="p-6 space-y-3">
                        <h1 className="text-2xl font-semibold">{event.title}</h1>
                        <p className="text-muted-foreground text-sm">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                                <CalendarDays size={15} />
                                {new Date(event.event_date).toDateString()} {event.event_time?.slice(0, 5)}
                            </span>
                            {event.venue && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={15} />
                                    {event.venue.name}, {event.venue.city}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Users size={15} />
                                {seatsLeft} seats left
                            </span>
                        </div>
                        {seatsLeft <= 10 && seatsLeft > 0 && (
                            <p className="text-xs text-amber-500 font-medium">Only {seatsLeft} seats remaining!</p>
                        )}
                        {seatsLeft === 0 && (
                            <p className="text-xs text-destructive font-medium">This event is fully booked.</p>
                        )}
                    </div>
                </div>

                {/* Ticket slot selector */}
                {slots.length > 0 && (
                    <div className="rounded-xl border bg-background shadow-sm p-6 space-y-3">
                        <h2 className="font-semibold flex items-center gap-2"><Ticket size={16} /> Select ticket type</h2>
                        <div className="grid gap-3">
                            {slots.map(slot => {
                                const available = slot.quantity - slot.sold;
                                const selected = selectedSlot?.id === slot.id;
                                return (
                                    <button
                                        key={slot.id}
                                        disabled={available <= 0}
                                        onClick={() => { setSelectedSlot(slot); setAppliedPromo(null); setPromoInput(""); }}
                                        className={`w-full text-left rounded-lg border px-4 py-3 transition-all ${selected ? "border-green-600 bg-green-50 dark:bg-green-950" : "border-border hover:border-green-400"} ${available <= 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium capitalize">{slot.slot_type.replace("_", " ")}</p>
                                                <p className="text-xs text-muted-foreground">{available} available</p>
                                            </div>
                                            <p className="font-semibold text-green-600">
                                                {slot.price === 0 || slot.price === null ? "Free" : `৳${slot.price}`}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Promo code */}
                {!event.is_free && (
                    <div className="rounded-xl border bg-background shadow-sm p-6 space-y-3">
                        <h2 className="font-semibold flex items-center gap-2"><Tag size={16} /> Promo code</h2>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter promo code"
                                value={promoInput}
                                onChange={e => setPromoInput(e.target.value.toUpperCase())}
                                disabled={!!appliedPromo}
                                className="uppercase tracking-widest"
                            />
                            {appliedPromo ? (
                                <Button variant="outline" onClick={() => { setAppliedPromo(null); setPromoInput(""); }}>
                                    Remove
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={handleApplyPromo}>Apply</Button>
                            )}
                        </div>
                        {appliedPromo && (
                            <p className="text-xs text-green-600 font-medium">
                                {appliedPromo.discount_percent}% discount applied
                            </p>
                        )}
                    </div>
                )}

                {/* Price summary & confirm */}
                <div className="rounded-xl border bg-background shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold">Order summary</h2>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Ticket price</span>
                            <span>{basePrice === 0 ? "Free" : `৳${basePrice}`}</span>
                        </div>
                        {appliedPromo && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({appliedPromo.discount_percent}%)</span>
                                <span>- ৳{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold text-base pt-2 border-t">
                            <span>Total</span>
                            <span>{finalPrice === 0 ? "Free" : `৳${finalPrice.toFixed(2)}`}</span>
                        </div>
                    </div>
                    <Button
                        className="w-full bg-green-600 text-black hover:bg-green-800 hover:text-white"
                        onClick={handleReserve}
                        disabled={submitting || seatsLeft === 0}
                    >
                        {submitting ? "Confirming..." : seatsLeft === 0 ? "Fully Booked" : "Confirm Reservation"}
                    </Button>
                </div>

            </div>
        </div>
    );
}