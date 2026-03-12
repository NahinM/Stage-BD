import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import PageNotFound from "./Pages/page-not-found.tsx";
import SignIn from "./Pages/signin/signin.tsx";
import SignUp from "./Pages/signup/signup.tsx";

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
    path: "/signup",
    element: <SignUp/>
  },
  {
    path: "*",
    element: <PageNotFound />,
  }
])