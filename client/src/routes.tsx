import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Pages/page-not-found.tsx";
import SignIn from "./Pages/signin/signin.tsx";
import SignUp from "./Pages/signup/signup.tsx";
import Test from "./Pages/test/test-page.tsx";
import EventFeed from "./Pages/Events/event-feed/even-feed.tsx";
import EventPage from "./Pages/Events/event-page/event-page.tsx";

import Home from "./Pages/home/home.tsx";
import ReservationPage from "./Pages/Reservation&Checkin/reservation/ReservationPage.tsx";
import ReservationSuccess from "./Pages/Reservation&Checkin/reservation/ReservationSuccess.tsx";
import MyReservations from "./Pages/Reservation&Checkin/my-reservations/MyReservations.tsx";
import CheckinDashboard from "./Pages/Reservation&Checkin/checkin/CheckinDashboard.tsx";
import ScannerPage from "./Pages/Reservation&Checkin/checkin/ScannerPage.tsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/test",
    element: <Test />
  },
  {
    path: "/feed",
    element: <EventFeed />
  },
  {
    path: "/signin",
    element: <SignIn/>
  },
  {
    path: "/signup",
    element: <SignUp/>
  },
  {
    path: "/event/:id",
    element: <EventPage />
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/reserve/:eventId",
    element: <ReservationPage />,
  },
  {
    path: "/reservation/success/:code",
    element: <ReservationSuccess />,
  },
  {
    path: "/my-reservations",
    element: <MyReservations />,
  },
  {
    path: "/checkin",
    element: <CheckinDashboard />,
  },
  {
    path: "/scanner",
    element: <ScannerPage />,
  },
])