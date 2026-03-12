import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Pages/page-not-found.tsx";
import SignIn from "./Pages/signin/signin.tsx";
import Test from "./Pages/test/test-page.tsx";

export const router = createBrowserRouter([
  {
    path: "/test",
    element: <Test />
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