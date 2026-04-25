import React from "react";
import NewProjectPage from "../pages/new-project";
import ProjectsPage from "../pages/projects";
import GalleryPage from "../pages/gallery";
import SettingsPage from "../pages/settings";
import ImageDetailsPage from "../pages/image-details";
import ProjectDetailsPage from "../pages/project-details";

export const publicCncRoutes = [
  { path: "gallery", element: <GalleryPage /> },
  { path: "gallery/:id", element: <ImageDetailsPage /> },
];

export const privateCncRoutes = [
  { path: "new-project", element: <NewProjectPage /> },
  { path: "projects", element: <ProjectsPage /> },
  { path: "settings", element: <SettingsPage /> },
  { path: "project/:id", element: <ProjectDetailsPage /> },
];
