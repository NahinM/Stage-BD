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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    element: <SignIn />,
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
    path: "*",
    element: <PageNotFound />,
  },
]);