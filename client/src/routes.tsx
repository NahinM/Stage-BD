import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Pages/page-not-found.tsx";
import SignIn from "./Pages/signin/signin.tsx";
import SignUp from "./Pages/signup/signup.tsx";
import Test from "./Pages/test/test-page.tsx";
import EventFeed from "./Pages/Events/event-feed/even-feed.tsx";
import Home from "./Pages/home/home.tsx";
import ArtistsPage from "./Pages/adittya/artist/artists-page.tsx";
import ArtistDetails from "./Pages/adittya/artist/artist-details.tsx";
import DigitalArtShowcase from "./Pages/adittya/showcase/digital-art-showcase.tsx";
import OrganizerAnalytics from "./Pages/adittya/analytics/organizer-analytics.tsx";
import CrowdfundingPage from "./Pages/adittya/crowdfunding/crowdfunding-page.tsx";
import SponsorListings from "./Pages/adittya/sponsor/sponsor-listings.tsx";
import EventPage from "./Pages/Events/event-page/event-page.tsx";
import EventCreate from "./Pages/Events/event-create/event-create.tsx";


import ReservationPage from "./Pages/Reservation&Checkin/reservation/ReservationPage.tsx";
import ReservationSuccess from "./Pages/Reservation&Checkin/reservation/ReservationSuccess.tsx";
import MyReservations from "./Pages/Reservation&Checkin/my-reservations/MyReservations.tsx";
import CheckinDashboard from "./Pages/Reservation&Checkin/checkin/CheckinDashboard.tsx";
import ScannerPage from "./Pages/Reservation&Checkin/checkin/ScannerPage.tsx";
import Profile from "./Pages/User/profile.tsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/feed",
    element: <EventFeed />,
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/artists",
    element: <ArtistsPage />,
  },
  {
    path: "/artists/:id",
    element: <ArtistDetails />,
  },
  {
    path: "/showcase",
    element: <DigitalArtShowcase />,
  },
  {
    path: "/organizer-analytics",
    element: <OrganizerAnalytics />,
  },
  {
    path: "/crowdfunding",
    element: <CrowdfundingPage />,
  },
  {
    path: "/sponsors",
    element: <SponsorListings />,
  },
  {
    path: "/event/:id",
    element: <EventPage />
  },
  {
    path: "/event/create",
    element: <EventCreate />
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
