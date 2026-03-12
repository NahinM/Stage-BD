import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Pages/page-not-found.tsx";
import SignIn from "./Pages/signin/signin.tsx";
import Test from "./Pages/test/test-page.tsx";
import EventFeed from "./Pages/Events/event-feed/even-feed.tsx";
import EventPage from "./Pages/Events/event-page/event-page.tsx";

export const router = createBrowserRouter([
  {
    path: "/test",
    element: <Test />
  },
  {
    path: "/feed",
    element: <EventFeed />
  },
  {
    path: "/event/:id",
    element: <EventPage />
  },
  
  {
    path: "/signin",
    element: <SignIn/>
  },
  {
    path: "*",
    element: <PageNotFound />,
  }
])