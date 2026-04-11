import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/login";
import DashboardPage from "../features/home/pages";
import ProcessPage from "../features/cnc/pages/process";
import AppContainer from "../shared/layout/app-container";
import HistoryPage from "../features/cnc/pages/history";
import GalleryPage from "../features/cnc/pages/gallery";
import SettingsPage from "../features/cnc/pages/settings";
import RegisterPage from "../features/auth/pages/register";
import ImageDetailsPage from "../features/cnc/pages/image-details";
import ProjectDetailsPage from "../features/cnc/pages/project-details";
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <AppContainer />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "new-project",
        element: <ProcessPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      { path: "gallery", element: <GalleryPage /> },
      { path: "gallery/:id", element: <ImageDetailsPage /> },
      { path: "project/:id", element: <ProjectDetailsPage /> },
    ],
  },
]);
