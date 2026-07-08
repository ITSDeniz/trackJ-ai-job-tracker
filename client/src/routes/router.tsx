import { createBrowserRouter } from "react-router-dom";
import { App } from "@/app/App";
import { HomePage } from "@/routes/HomePage";
import { LoginPage } from "@/routes/LoginPage";
import { RegisterPage } from "@/routes/RegisterPage";
import { ProtectedLayout } from "@/features/auth/ProtectedLayout";
import { ApplicationsPage } from "@/routes/ApplicationsPage";
import { AiAssistantPage } from "@/routes/AiAssistantPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/job-applications",
            element: <ApplicationsPage />,
          },
          {
            path: "/ai-assistant",
            element: <AiAssistantPage />,
          },
        ],
      },
    ],
  },
]);
