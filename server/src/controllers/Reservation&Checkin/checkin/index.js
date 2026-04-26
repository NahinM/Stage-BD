import {
  getReservationByCode,
  getCheckinByReservation,
  createCheckin,
  getEventCheckins as getEventCheckinsModel,
  searchEventGuests as searchEventGuestsModel,
  getReservationById,
} from "../../../models/Reservation&Checkin/checkin/index.js";

export const scanGuestCheckin = async (req, res) => {
  try {
    const { reservationCode } = req.body;
    const staffId = "00960726-dd44-48ea-9ed8-d0bcef050014";

    if (!reservationCode) {
      return res.status(400).json({ message: "Reservation code required" });
    }

    const reservation = await getReservationByCode(
      reservationCode.trim().toUpperCase()
    );

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "confirmed") {
      return res.status(400).json({ message: "Invalid reservation" });
    }

    const exists = await getCheckinByReservation(reservation.id);

    if (exists) {
      return res.status(409).json({ message: "Already checked in" });
    }

    const checkin = await createCheckin(
      reservation.id,
      staffId,
      reservation.event_id
    );

    if (!checkin) {
      return res.status(500).json({ message: "Failed to create check-in" });
    }

    return res.json({
      message: "Check-in success",
      checkin,
      guest: {
        name:
          `${reservation.firstname || ""} ${reservation.lastname || ""}`.trim() ||
          reservation.username ||
          "Guest",
      },
    });
  } catch (err) {
    console.error("scanGuestCheckin error:", err);
    return res.status(500).json({ message: "Check-in failed" });
  }
};

export const getEventCheckins = async (req, res) => {
  try {
    const { eventId } = req.params;
    const data = await getEventCheckinsModel(eventId);
    return res.json({ checkins: data });
  } catch (err) {
    console.error("getEventCheckins error:", err);
    return res.status(500).json({ message: "Failed to fetch checkins" });
  }
};

export const searchEventGuests = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { query } = req.query;

    if (!query?.trim()) {
      return res.json({ guests: [] });
    }

    const guests = await searchEventGuestsModel(eventId, query.trim());
    return res.json({ guests });
  } catch (err) {
    console.error("searchEventGuests error:", err);
    return res.status(500).json({ message: "Failed to search guests" });
  }
};

export const manualCheckinByReservation = async (req, res) => {
  try {
    const { reservationId } = req.body;
    const staffId = "00960726-dd44-48ea-9ed8-d0bcef050014";

    if (!reservationId) {
      return res.status(400).json({ message: "Reservation id required" });
    }

    const reservation = await getReservationById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "confirmed") {
      return res.status(400).json({ message: "Invalid reservation" });
    }

    const exists = await getCheckinByReservation(reservation.id);

    if (exists) {
      return res.status(409).json({ message: "Already checked in" });
    }

    const checkin = await createCheckin(
      reservation.id,
      staffId,
      reservation.event_id
    );

    if (!checkin) {
      return res.status(500).json({ message: "Failed to create check-in" });
    }

    return res.json({
      message: "Manual check-in successful",
      checkin,
      guest: {
        name:
          `${reservation.firstname || ""} ${reservation.lastname || ""}`.trim() ||
          reservation.username ||
          "Guest",
      },
    });
  } catch (err) {
    console.error("manualCheckinByReservation error:", err);
    return res.status(500).json({ message: "Manual check-in failed" });
  }
};