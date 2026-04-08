import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Pages/page-not-found.tsx";
import SignIn from "./Pages/signin/signin.tsx";
import SignUp from "./Pages/signup/signup.tsx";
import Test from "./Pages/test/test-page.tsx";
import EventFeed from "./Pages/Events/event-feed/even-feed.tsx";
import Home from "./Pages/home/home.tsx";
import Reservation from "./Pages/Reservation/Reservation.tsx";
import Checkin from "./Pages/Checkin/Checkin.tsx";
import PersonalizedFeed from "./Pages/Member3/Feed/PersonalizedFeed.tsx";
import ArtistProfile from "./Pages/Member3/Artist/ArtistProfile.tsx";
import ContestBoard from "./Pages/Member3/Contests/ContestBoard.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/feed/personalized",
    element: <PersonalizedFeed />
  },
  {
    path: "/artist/:artistId",
    element: <ArtistProfile />
  },
  {
    path: "/contests",
    element: <ContestBoard />
  },
  {
    path: "/reservation",
    element: <Reservation />
  },
  {
    path: "/checkin",
    element: <Checkin />
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
  }
])