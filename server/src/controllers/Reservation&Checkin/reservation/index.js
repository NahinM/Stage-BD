import {
  getEventWithSlots,
  getTicketSlots,
  validatePromoCode,
  checkExistingReservation,
  createReservation,
  incrementSlotSold,
  incrementSeatsReserved,
  getUserReservations,
  cancelReservation,
} from "../../../models/Reservation&Checkin/reservation/index.js";

import { nanoid } from "nanoid";

export const getEventDetails = async (req, res) => {
  const { eventId } = req.params;

  const event = await getEventWithSlots(eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const slots = await getTicketSlots(eventId);

  res.json({ event, slots });
};
export const applyPromoCode = async (req, res) => {
    const { eventId, code } = req.body;
    const promo = await validatePromoCode(eventId, code);
    if (!promo) return res.status(400).json({ message: "Invalid or expired promo code" });
    res.json({ promo });
};

export const reserveTicket = async (req, res) => {
    const { eventId, slotId, promoCodeId, finalPrice } = req.body;
    const userId = "00960726-dd44-48ea-9ed8-d0bcef050014";
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const event = await getEventWithSlots(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "published") return res.status(400).json({ message: "Event is not available" });
    if (event.seats_reserved >= event.seat_limit) return res.status(400).json({ message: "Event is fully booked" });

    const existing = await checkExistingReservation(userId, eventId);
    if (existing) return res.status(400).json({ message: "You already have a reservation for this event" });

    const reservationCode = nanoid(10).toUpperCase();
    const reservation = await createReservation({ userId, eventId, slotId, promoCodeId, reservationCode, finalPrice });
    if (!reservation) return res.status(500).json({ message: "Failed to create reservation" });

    await incrementSlotSold(slotId);
    await incrementSeatsReserved(eventId);

    res.status(201).json({ message: "Reservation confirmed!", reservation });
};

export const getMyReservations = async (req, res) => {
    const userId = "00960726-dd44-48ea-9ed8-d0bcef050014";
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    const reservations = await getUserReservations(userId);
    res.json({ reservations });
};

export const cancelMyReservation = async (req, res) => {
    const { reservationId } = req.params;
    const userId = req.user?.id;
    const result = await cancelReservation(reservationId, userId);
    if (!result) return res.status(400).json({ message: "Could not cancel reservation" });
    res.json({ message: "Reservation cancelled successfully" });
};