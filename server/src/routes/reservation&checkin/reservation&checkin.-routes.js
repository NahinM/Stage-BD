import {RAC} from "../../controllers/controller.js";
import { app } from "../../config/config.js";

app.get('/api/reservation/event/:eventId', RAC.reservation.getEventDetails);
app.post('/api/reservation/promo', RAC.reservation.applyPromoCode);
app.post('/api/reservation/reserve', RAC.reservation.reserveTicket);
app.get('/api/reservation/my', RAC.reservation.getMyReservations);
app.patch('/api/reservation/cancel/:reservationId', RAC.reservation.cancelMyReservation);

app.post('/api/checkin/scan', RAC.checkin.scanGuestCheckin);
app.get('/api/checkin/event/:eventId', RAC.checkin.getEventCheckins);
app.get('/api/checkin/search/:eventId', RAC.checkin.searchEventGuests);
app.post('/api/checkin/manual', RAC.checkin.manualCheckinByReservation);


app.post("/api/waitlist/join", RAC.waitlist.joinWaitlistController);
app.get("/api/waitlist/position/:eventId", RAC.waitlist.getUserPositionController);
app.get("/api/waitlist/event/:eventId", RAC.waitlist.getEventWaitlistController);
app.delete("/api/waitlist/cancel/:id", RAC.waitlist.cancelWaitlistController);
app.get("/api/waitlist/organizer/events", RAC.waitlist.getOrganizerEventsController);

app.get("/db-test", async (req, res) => {
const { supabase } = await import("../config/database.js");

  const { data, error } = await supabase
    .from("event")
    .select("*")
    .limit(1);

  if (error) {
    console.error(error);
    return res.status(500).json({ error });
  }

  res.json({ message: "DB Connected ✅", data });
});