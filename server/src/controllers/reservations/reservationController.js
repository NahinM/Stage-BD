import * as reservationModel from "../../models/reservations/reservation.js";
import * as waitlistModel from "../../models/waitlists/waitlist.js";
import * as promoModel from "../../models/promo/promo.js";
import { supabase } from "../../config/database.js";

function generateCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

export const bookReservation = async (req, res) => {
    const { username, event_id, promo_code } = req.body;
    try {
        const { data: eventData } = await supabase.from('event').select('capacity').eq('event_id', event_id).single();
        const capacity = eventData?.capacity || 100;
        
        const existing = await reservationModel.getReservationsByEvent(event_id);
        const confirmedCount = existing.filter(r => r.status === 'confirmed').length;

        if (confirmedCount >= capacity) {
            return res.status(400).json({ error: "Event full", waitlistAvailable: true });
        }

        let discount = 0;
        if (promo_code) {
            const promo = await promoModel.getValidPromo(promo_code, event_id);
            if (!promo) return res.status(400).json({ error: "Invalid promo code" });
            if (promo.quantity_used >= promo.quantity_limit || new Date(promo.expires_at) < new Date()) {
                 return res.status(400).json({ error: "Promo code expired or limit reached" });
            }
            discount = promo.discount_percentage;
            await promoModel.incrementPromoUsage(promo.promo_id, promo.quantity_used);
        }

        const reservation_code = generateCode();
        const qr_code_string = `STAGEBD-${event_id}-${username}-${reservation_code}`;
        const seat_number = `S-${confirmedCount + 1}`;

        const newRes = await reservationModel.createReservation({
            username,
            event_id,
            reservation_code,
            qr_code_string,
            seat_number
        });

        res.status(200).json({ success: true, reservation: newRes, discount });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const joinWaitlist = async (req, res) => {
     const { username, event_id } = req.body;
     try {
         const entry = await waitlistModel.joinWaitlistModel({ username, event_id });
         res.status(200).json({ success: true, waitlist: entry });
     } catch (err) {
         res.status(500).json({ error: err.message });
     }
}

export const cancelReservation = async (req, res) => {
    const { reservation_id, event_id } = req.body;
    try {
        await reservationModel.updateReservationStatus(reservation_id, 'cancelled');
        const nextPerson = await waitlistModel.getFirstInWaitlist(event_id);
        if (nextPerson) {
             const reservation_code = generateCode();
             const qr_code_string = `STAGEBD-${event_id}-${nextPerson.username}-${reservation_code}`;
             await reservationModel.createReservation({
                username: nextPerson.username,
                event_id,
                reservation_code,
                qr_code_string,
                seat_number: 'W-0'
             });
             await waitlistModel.updateWaitlistStatus(nextPerson.waitlist_id, 'notified');
        }
        res.status(200).json({ success: true, message: "Reservation cancelled."});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getUserReservations = async (req, res) => {
    const { username } = req.params;
    try {
        const list = await reservationModel.getUserReservations(username);
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
