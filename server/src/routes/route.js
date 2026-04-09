import * as controller from "../controllers/controller.js";
import { app } from "../config/config.js";

app.get('/api/hello', controller.helloController.getHello);
app.post('/api/signin', controller.signInController.signIn);
app.post('/api/signup', controller.signUpController.signUp);

app.get('/api/reservation/event/:eventId', controller.reservationController.getEventDetails);
app.post('/api/reservation/promo', controller.reservationController.applyPromoCode);
app.post('/api/reservation/reserve', controller.reservationController.reserveTicket);
app.get('/api/reservation/my', controller.reservationController.getMyReservations);
app.patch('/api/reservation/cancel/:reservationId', controller.reservationController.cancelMyReservation);

app.post('/api/checkin/scan', controller.checkinController.scanGuestCheckin);
app.get('/api/checkin/event/:eventId', controller.checkinController.getEventCheckins);
app.get('/api/checkin/search/:eventId', controller.checkinController.searchEventGuests);
app.post('/api/checkin/manual', controller.checkinController.manualCheckinByReservation);app.get("/db-test", async (req, res) => {
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