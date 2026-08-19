/**
 * Tour steps for Zukhruf CNC Hub (driver.js)
 * Split into page-specific tours so each runs only on its page (first visit).
 */

export const TOUR_KEYS = {
  home: "zukhruf_tour_home_v1",
  np: "zukhruf_tour_np_v1",
  pd: "zukhruf_tour_pd_v1",
  gallery: "zukhruf_tour_gallery_v1",
  galleryDetail: "zukhruf_tour_gallery_detail_v1",
  projects: "zukhruf_tour_projects_v1",
  simulator: "zukhruf_tour_simulator_v1",
simulatorDetail: "zukhruf_tour_simulator_detail_v1",
settings: "zukhruf_tour_settings_v1",
patterns: "zukhruf_tour_patterns_v1",
};

/** Navbar / home tour */
export function buildHomeSteps(t, { isLoggedIn }) {
  const steps = [
    {
      element: "[data-tour='nav-brand']",
      popover: {
        title: t("tour.brand_title"),
        description: t("tour.brand_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='nav-links']",
      popover: {
        title: t("tour.nav_title"),
        description: t("tour.nav_desc"),
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "[data-tour='nav-lang']",
      popover: {
        title: t("tour.lang_title"),
        description: t("tour.lang_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='nav-theme']",
      popover: {
        title: t("tour.theme_title"),
        description: t("tour.theme_desc"),
        side: "bottom",
        align: "end",
      },
    },
  ];

  if (!isLoggedIn) {
    steps.push({
      element: "[data-tour='nav-auth']",
      popover: {
        title: t("tour.auth_title"),
        description: t("tour.auth_desc"),
        side: "bottom",
        align: "end",
      },
    });
  } else {
    steps.push({
      element: "[data-tour='nav-settings']",
      popover: {
        title: t("tour.settings_title"),
        description: t("tour.settings_desc"),
        side: "bottom",
        align: "end",
      },
    });
  }

  steps.push(
    {
      element: "[data-tour='nav-new-project']",
      popover: {
        title: t("tour.new_project_nav_title"),
        description: t("tour.new_project_nav_desc"),
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "[data-tour='nav-simulator']",
      popover: {
        title: t("tour.sim_nav_title"),
        description: t("tour.sim_nav_desc"),
        side: "bottom",
        align: "center",
      },
    },
  );
    // ——— Home page body ———
  steps.push(
    {
      element: "[data-tour='home-start']",
      popover: {
        title: t("tour.home_start_title"),
        description: t("tour.home_start_desc"),
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "[data-tour='home-explore']",
      popover: {
        title: t("tour.home_explore_title"),
        description: t("tour.home_explore_desc"),
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "[data-tour='home-view-all']",
      popover: {
        title: t("tour.home_view_all_title"),
        description: t("tour.home_view_all_desc"),
        side: "left",
        align: "center",
      },
    },
    {
      element: "[data-tour='home-pattern-card']",
      popover: {
        title: t("tour.home_pattern_card_title"),
        description: t("tour.home_pattern_card_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='home-cta']",
      popover: {
        title: t("tour.home_cta_title"),
        description: t("tour.home_cta_desc"),
        side: "top",
        align: "center",
      },
    },
  );

  return steps;
}

/** New Project page tour */
export function buildNewProjectSteps(t) {
  return [
    {
      element: "[data-tour='np-upload']",
      popover: {
        title: t("tour.np_upload_title"),
        description: t("tour.np_upload_desc"),
        side: "right",
        align: "start",
      },
    },
    {
      element: "[data-tour='np-settings']",
      popover: {
        title: t("tour.np_settings_title"),
        description: t("tour.np_settings_desc"),
        side: "right",
        align: "start",
      },
    },
    {
      element: "[data-tour='np-preview']",
      popover: {
        title: t("tour.np_preview_title"),
        description: t("tour.np_preview_desc"),
        side: "left",
        align: "start",
      },
    },
    {
      element: "[data-tour='np-create']",
      popover: {
        title: t("tour.np_create_title"),
        description: t("tour.np_create_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='np-download-gcode']",
      popover: {
        title: t("tour.np_download_title"),
        description: t("tour.np_download_desc"),
        side: "left",
        align: "center",
      },
    },
  ];
}

/** Project details page tour */
/** Project details page tour */
export function buildProjectDetailsSteps(t) {
  return [
    {
      element: "[data-tour='pd-edit']",
      popover: {
        title: t("tour.pd_edit_title"),
        description: t("tour.pd_edit_desc"),
        side: "right",
        align: "start",
      },
    },
    {
      element: "[data-tour='pd-generate']",
      popover: {
        title: t("tour.pd_generate_title"),
        description: t("tour.pd_generate_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='pd-download']",
      popover: {
        title: t("tour.pd_download_title"),
        description: t("tour.pd_download_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='pd-tab-terminal']",
      popover: {
        title: t("tour.pd_tab_terminal_title"),
        description: t("tour.pd_tab_terminal_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='pd-tab-3d']",
      popover: {
        title: t("tour.pd_tab_3d_title"),
        description: t("tour.pd_tab_3d_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='pd-tab-report']",
      popover: {
        title: t("tour.pd_tab_report_title"),
        description: t("tour.pd_tab_report_desc"),
        side: "bottom",
        align: "start",
      },
    },
  ];
}
/** Gallery list page tour */
export function buildGallerySteps(t) {
  return [
    {
      element: "[data-tour='gallery-upload']",
      popover: {
        title: t("tour.gallery_upload_title"),
        description: t("tour.gallery_upload_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='gallery-filter-all']",
      popover: {
        title: t("tour.gallery_filter_all_title"),
        description: t("tour.gallery_filter_all_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='gallery-filter-patterns']",
      popover: {
        title: t("tour.gallery_filter_patterns_title"),
        description: t("tour.gallery_filter_patterns_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='gallery-card']",
      popover: {
        title: t("tour.gallery_card_title"),
        description: t("tour.gallery_card_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='gallery-card-view']",
      popover: {
        title: t("tour.gallery_card_view_title"),
        description: t("tour.gallery_card_view_desc"),
        side: "left",
        align: "center",
      },
    },
    {
      element: "[data-tour='gallery-card-start']",
      popover: {
        title: t("tour.gallery_card_start_title"),
        description: t("tour.gallery_card_start_desc"),
        side: "left",
        align: "center",
      },
    },
    {
      element: "[data-tour='gallery-card-delete']",
      popover: {
        title: t("tour.gallery_card_delete_title"),
        description: t("tour.gallery_card_delete_desc"),
        side: "left",
        align: "center",
      },
    },
  ];
}

/** Gallery image details page tour */
export function buildGalleryDetailSteps(t) {
  return [
    {
      element: "[data-tour='gd-back']",
      popover: {
        title: t("tour.gd_back_title"),
        description: t("tour.gd_back_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='gd-preview']",
      popover: {
        title: t("tour.gd_preview_title"),
        description: t("tour.gd_preview_desc"),
        side: "right",
        align: "start",
      },
    },
    {
      element: "[data-tour='gd-start']",
      popover: {
        title: t("tour.gd_start_title"),
        description: t("tour.gd_start_desc"),
        side: "left",
        align: "center",
      },
    },
    {
      element: "[data-tour='gd-delete']",
      popover: {
        title: t("tour.gd_delete_title"),
        description: t("tour.gd_delete_desc"),
        side: "left",
        align: "center",
      },
    },
  ];
}
/** Projects list page tour */
export function buildProjectsSteps(t) {
  return [
    {
      element: "[data-tour='projects-new']",
      popover: {
        title: t("tour.projects_new_title"),
        description: t("tour.projects_new_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='projects-card-view']",
      popover: {
        title: t("tour.projects_view_title"),
        description: t("tour.projects_view_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='projects-card-download']",
      popover: {
        title: t("tour.projects_download_title"),
        description: t("tour.projects_download_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='projects-card-delete']",
      popover: {
        title: t("tour.projects_delete_title"),
        description: t("tour.projects_delete_desc"),
        side: "top",
        align: "center",
      },
    },
  ];
}
/** Simulator list page tour */
export function buildSimulatorSteps(t) {
  return [
    {
      element: "[data-tour='sim-upload']",
      popover: {
        title: t("tour.sim_upload_title"),
        description: t("tour.sim_upload_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='sim-card-details']",
      popover: {
        title: t("tour.sim_card_details_title"),
        description: t("tour.sim_card_details_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='sim-card-download']",
      popover: {
        title: t("tour.sim_card_download_title"),
        description: t("tour.sim_card_download_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='sim-card-delete']",
      popover: {
        title: t("tour.sim_card_delete_title"),
        description: t("tour.sim_card_delete_desc"),
        side: "top",
        align: "center",
      },
    },
  ];
}

/** Simulator details page tour */
export function buildSimulatorDetailSteps(t) {
  return [
    {
      element: "[data-tour='sim-back']",
      popover: {
        title: t("tour.sim_back_title"),
        description: t("tour.sim_back_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='sim-preview']",
      popover: {
        title: t("tour.sim_preview_title"),
        description: t("tour.sim_preview_desc"),
        side: "left",
        align: "start",
      },
    },
    {
      element: "[data-tour='sim-download']",
      popover: {
        title: t("tour.sim_download_title"),
        description: t("tour.sim_download_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='sim-delete']",
      popover: {
        title: t("tour.sim_delete_title"),
        description: t("tour.sim_delete_desc"),
        side: "bottom",
        align: "end",
      },
    },
  ];
}
/** Account settings page tour */
export function buildSettingsSteps(t) {
  return [
    {
      element: "[data-tour='settings-profile']",
      popover: {
        title: t("tour.settings_profile_title"),
        description: t("tour.settings_profile_desc"),
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "[data-tour='settings-security']",
      popover: {
        title: t("tour.settings_security_title"),
        description: t("tour.settings_security_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='settings-save']",
      popover: {
        title: t("tour.settings_save_title"),
        description: t("tour.settings_save_desc"),
        side: "top",
        align: "center",
      },
    },
  ];
}
/** Public patterns library tour */
export function buildPatternsSteps(t) {
  return [
    {
      element: "[data-tour='patterns-header']",
      popover: {
        title: t("tour.patterns_header_title"),
        description: t("tour.patterns_header_desc"),
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "[data-tour='patterns-card']",
      popover: {
        title: t("tour.patterns_card_title"),
        description: t("tour.patterns_card_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='patterns-view']",
      popover: {
        title: t("tour.patterns_view_title"),
        description: t("tour.patterns_view_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='patterns-load-more']",
      popover: {
        title: t("tour.patterns_load_more_title"),
        description: t("tour.patterns_load_more_desc"),
        side: "top",
        align: "center",
      },
    },
  ];
}