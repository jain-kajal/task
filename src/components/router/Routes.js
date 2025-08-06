import { createBrowserRouter } from "react-router";
import App from "../../App";
import Dashboard from "../Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
    ],
  },
]);
