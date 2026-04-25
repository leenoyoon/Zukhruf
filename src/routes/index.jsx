import { createBrowserRouter } from "react-router-dom";
import AppContainer from "../shared/layout/app-container";
import { authRoutes } from "../features/auth/routes";
import { homeRoutes } from "../features/home/routes";
import { publicCncRoutes, privateCncRoutes } from "../features/cnc/routes";
import { AuthGuard } from "../features/auth/guards/AuthGuard";
import AllPatternsPage from "../features/cnc/pages/all-patterns";

export const router = createBrowserRouter([
  ...authRoutes,

  {
    path: "/",
    element: <AppContainer />,
    children: [
      ...homeRoutes,
      ...publicCncRoutes,
      {
        path: "/patterns",
        element: <AllPatternsPage />,
      },
    ],
  },

  {
    path: "/",
    element: (
      <AuthGuard>
        <AppContainer />
      </AuthGuard>
    ),
    children: [...privateCncRoutes],
  },
]);
