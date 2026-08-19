import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css";
import {
  TOUR_KEYS,
  buildHomeSteps,
  buildNewProjectSteps,
  buildProjectsSteps,
  buildProjectDetailsSteps,
  buildGallerySteps,
  buildGalleryDetailSteps,
  buildSimulatorSteps,
buildSimulatorDetailSteps,
buildSettingsSteps,
buildPatternsSteps,
} from "./steps";
import { useAuth } from "../../features/auth/context/AuthContext";

/**
 * Page-scoped first-visit tours (driver.js).
 * - Home/navbar: first visit to the site
 * - New Project: first open of create page
 * - Project details: first open of a project page
 * - Restart anytime via window.startZukhrufTour() (help button)
 */
export function AppTour() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const driverRef = useRef(null);

const destroyTour = useCallback(() => {
  document.body.classList.remove("zukhruf-tour-active");
  if (driverRef.current) {
    try {
      driverRef.current.destroy();
    } catch (_) {}
    driverRef.current = null;
  }
}, []);

  const startTour = useCallback(
    (steps, storageKey, force = false) => {
      if (!force) {
        try {
          if (localStorage.getItem(storageKey) === "1") return;
        } catch (_) {}
      }

      destroyTour();

      const validSteps = steps.filter((s) => {
        if (!s.element) return true;
        return !!document.querySelector(s.element);
      });

      if (validSteps.length === 0) return;

      const isRtl = i18n.language === "ar";

      const d = driver({
        showProgress: true,
        animate: true,
        overlayOpacity: 0.45,
        stagePadding: 8,
        stageRadius: 12,
        allowClose: true,
        smoothScroll: true,
        popoverClass: "zukhruf-tour",
        progressText: isRtl
          ? "{{current}} من {{total}}"
          : "{{current}} of {{total}}",
        nextBtnText: t("tour.next"),
        prevBtnText: t("tour.prev"),
        doneBtnText: t("tour.done"),
        closeBtnText: t("tour.close"),
        steps: validSteps,
    onDestroyStarted: () => {
  try {
    localStorage.setItem(storageKey, "1");
  } catch (_) {}
  document.body.classList.remove("zukhruf-tour-active");
  destroyTour();
},
onDestroyed: () => {
  try {
    localStorage.setItem(storageKey, "1");
  } catch (_) {}
  document.body.classList.remove("zukhruf-tour-active");
},
      });

      document.body.classList.add("zukhruf-tour-active");
driverRef.current = d;
d.drive();
    },
    [t, i18n.language, destroyTour],
  );

  // Help button: restart tour for current page
// Auto-start once per page (first visit only)
useEffect(() => {
  const path = location.pathname;

  const timer = setTimeout(() => {
if (path.includes("/new") || path.includes("projects/create")) {
  startTour(buildNewProjectSteps(t), TOUR_KEYS.np, false);
} else if (path.match(/\/project\/\d+/) || path.includes("/project/")) {
  startTour(buildProjectDetailsSteps(t), TOUR_KEYS.pd, false);
} else if (path === "/projects" || path.startsWith("/projects")) {
  startTour(buildProjectsSteps(t), TOUR_KEYS.projects, false);
} else if (path.match(/^\/simulator\/\d+/)) {
  startTour(buildSimulatorDetailSteps(t), TOUR_KEYS.simulatorDetail, false);
} else if (path.startsWith("/simulator")) {
  startTour(buildSimulatorSteps(t), TOUR_KEYS.simulator, false);
} else if (path.match(/^\/gallery\/\d+/)) {
  startTour(buildGalleryDetailSteps(t), TOUR_KEYS.galleryDetail, false);
} else if (path.startsWith("/gallery")) {
  startTour(buildGallerySteps(t), TOUR_KEYS.gallery, false);
}else if (path.startsWith("/patterns")) {
  startTour(buildPatternsSteps(t), TOUR_KEYS.patterns, false);
} else if (path.startsWith("/settings")) {
  startTour(buildSettingsSteps(t), TOUR_KEYS.settings, false);
}
else {
  startTour(buildHomeSteps(t, { isLoggedIn }), TOUR_KEYS.home, false);
}

  }, 2000);

  return () => {
    clearTimeout(timer);
    destroyTour();
  };
}, [location.pathname, t, isLoggedIn, startTour, destroyTour]);

  return null;
}

export { TOUR_KEYS };