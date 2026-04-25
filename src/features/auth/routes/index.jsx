import React from "react";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import { GuestGuard } from "../guards/GuestGuard";

export const authRoutes = [
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
];