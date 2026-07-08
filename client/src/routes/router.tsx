import { createBrowserRouter } from "react-router-dom";
import { App } from "@/app/App";
import { HomePage } from "@/routes/HomePage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);
