import { createBrowserRouter } from "react-router-dom";
import { App } from "@/app/App";
import { HomePage } from "@/routes/HomePage";
import { LoginPage } from "@/routes/LoginPage";
import { RegisterPage } from "@/routes/RegisterPage";
import { ProtectedLayout } from "@/features/auth/ProtectedLayout";
import { ApplicationsPage } from "@/routes/ApplicationsPage";
import { AiAssistantPage } from "@/routes/AiAssistantPage";
import { LandingPage } from "@/routes/LandingPage";
import { CompaniesPage } from "@/routes/CompaniesPage";
import { TasksPage } from "@/routes/TasksPage";
import { NotFoundPage } from "@/routes/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
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
            path: "/dashboard",
            element: <HomePage />,
          },
          {
            path: "/job-applications",
            element: <ApplicationsPage />,
          },
          {
            path: "/companies",
            element: <CompaniesPage />,
          },
          {
            path: "/tasks",
            element: <TasksPage />,
          },
          {
            path: "/ai-assistant",
            element: <AiAssistantPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
