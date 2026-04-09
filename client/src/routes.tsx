import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Pages/page-not-found.tsx";
import SignIn from "./Pages/signin/signin.tsx";
import SignUp from "./Pages/signup/signup.tsx";
import Test from "./Pages/test/test-page.tsx";
import EventFeed from "./Pages/Events/event-feed/even-feed.tsx";
import Home from "./Pages/home/home.tsx";
import ReservationPage from "./Pages/reservation/ReservationPage.tsx";
import ReservationSuccess from "./Pages/reservation/ReservationSuccess.tsx";
import MyReservations from "./Pages/my-reservations/MyReservations.tsx";
import CheckinDashboard from "./Pages/checkin/CheckinDashboard.tsx";
import ScannerPage from "./Pages/checkin/ScannerPage.tsx";
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