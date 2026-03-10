import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import PageNotFound from "./Pages/page-not-found.tsx";
import SignIn from "./Pages/signin.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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