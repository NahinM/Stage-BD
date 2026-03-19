import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Pages/page-not-found.tsx";
import SignIn from "./Pages/signin/signin.tsx";
import SignUp from "./Pages/signup/signup.tsx";
import Test from "./Pages/test/test-page.tsx";
import EventFeed from "./Pages/Events/event-feed/even-feed.tsx";
import Home from "./Pages/home/home.tsx";

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
  }
])