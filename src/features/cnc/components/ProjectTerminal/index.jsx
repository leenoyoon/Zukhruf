import React, { useState } from "react";
import { Card, Button, Spinner, Modal } from "react-bootstrap";
import {
  FiCode,
  FiCpu,
  FiDownload,
  FiBox,
  FiMaximize2,
  FiExternalLink,
  FiX,
  FiBarChart2,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { MachiningReport } from "../MachiningReport";
import "./style.css";
import { ProgressBar } from "react-bootstrap";

export const ProjectTerminal = ({
  project,
  isGenerating,
  gcodePreview,
  handleGenerateGCode,
}) => {
  const { t } = useTranslation();

  // Which panel fills the card: the text terminal (the original, single
  // full-height look) or the 3D simulation. Only one renders at a time --
  // the earlier version stacked both permanently, which changed the whole
  // card's height and broke the original layout. Tabs keep the original
  // full-bleed panel look intact and just let you switch what's inside it.
  const [activeView, setActiveView] = useState("terminal");
  const hasSimulation = Boolean(project?.simulation_file_url);
  const hasReport = Boolean(project?.processing_info?.gcode_report);

  // Fullscreen modal state for the 3D preview -- lets the user blow the
  // simulation up to fill the whole viewport without leaving the page.
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

React.useEffect(() => {
  if (!isGenerating) {
    setProgress(0);
    return;
  }
  setProgress(3);
  const id = setInterval(() => {
    setProgress((p) => {
      // تقدم بطيء وثابت تقريبًا، ما يوصل فوق 85 قبل ما يخلّص السيرفر
      if (p >= 85) return p;
      return Math.min(85, p + 1.2);
    });
  }, 1200); // كل 1.2 ثانية يزيد شوي
  return () => clearInterval(id);
}, [isGenerating]);

  return (
    <>
    <Card
      className="modern-card border-0 h-100 d-flex flex-column"
      style={{ minHeight: "600px", overflow: "hidden" }}
    >
      <div
        className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
        style={{
          borderColor: "var(--glass-border) !important",
          backgroundColor: "var(--glass-bg)",
        }}
      >
        <div>
          <h5 className="fw-bold text-theme mb-1 d-flex align-items-center gap-2">
            <FiCode className="text-primary" /> {t("project_terminal.title")}
          </h5>
          <small className="text-theme-muted">
            {t("project_terminal.subtitle")}
          </small>
        </div>

        <div className="d-flex gap-2">
          <Button
            onClick={handleGenerateGCode}
            disabled={isGenerating}
            className="btn-primary-custom px-4 py-2 fw-bold d-flex align-items-center gap-2"
          >
            {isGenerating ? <Spinner size="sm" /> : <FiCpu size={18} />}
            {isGenerating
              ? t("project_terminal.btn_processing")
              : t("project_terminal.btn_generate")}
          </Button>

          <Button
            href={project?.gcode_file_url || "#"}
            target="_blank"
            download
            disabled={!project?.gcode_file_url}
            className="px-4 py-2 fw-bold d-flex align-items-center gap-2 text-decoration-none transition-all"
            style={{
              backgroundColor: "transparent",
              border: "1px solid var(--glass-border)",
              color: "var(--text-main)",
              opacity: !project?.gcode_file_url ? 0.5 : 1,
              pointerEvents: !project?.gcode_file_url ? "none" : "auto",
            }}
          >
            <FiDownload size={18} /> {t("project_terminal.btn_download")}
          </Button>
        </div>
      </div>

      {/* Tab bar only appears once there's actually a 3D preview to switch
          to -- before that, this row is skipped entirely and the card
          looks exactly like it always did. */}
      {(hasSimulation || hasReport) && (
        <div
          className="d-flex align-items-center justify-content-between gap-2 px-4 pt-3 pb-0"
          style={{
            borderBottom: "1px solid var(--glass-border)",
            backgroundColor: "var(--glass-bg)",
          }}
        >
          <div className="d-flex gap-2">
            {[
              { key: "terminal", icon: FiCode, label: t("project_terminal.tab_terminal") },
              ...(hasSimulation
                ? [{ key: "3d", icon: FiBox, label: t("project_terminal.tab_3d") }]
                : []),
              ...(hasReport
                ? [{ key: "report", icon: FiBarChart2, label: t("project_terminal.tab_report") }]
                : []),
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveView(key)}
                className="d-flex align-items-center gap-2 fw-bold small border-0 bg-transparent px-3 py-2"
                style={{
                  cursor: "pointer",
                  color: activeView === key ? "var(--primary-orange)" : "var(--text-muted)",
                  borderBottom:
                    activeView === key
                      ? "2px solid var(--primary-orange)"
                      : "2px solid transparent",
                  marginBottom: "-1px",
                }}
              >
                {Icon && <Icon size={14} />} {label}
              </button>
            ))}
          </div>

          {/* Only relevant once you're actually looking at the 3D view */}
          {activeView === "3d" && (
            <div className="d-flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setShowFullscreen(true)}
                title={t("project_terminal.expand")}
                className="d-flex align-items-center justify-content-center border-0 bg-transparent p-2"
                style={{ cursor: "pointer", color: "var(--text-muted)" }}
              >
                <FiMaximize2 size={16} />
              </button>
              <a
                href={project.simulation_file_url}
                target="_blank"
                rel="noopener noreferrer"
                title={t("project_terminal.open_new_tab")}
                className="d-flex align-items-center justify-content-center p-2"
                style={{ cursor: "pointer", color: "var(--text-muted)" }}
              >
                <FiExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      )}
      {isGenerating && (
  <div
    className="px-4 py-3"
    style={{
      backgroundColor: "var(--glass-bg)",
      borderBottom: "1px solid var(--glass-border)",
    }}
  >
    <div className="d-flex justify-content-between align-items-center mb-2">
      <small className="fw-bold text-theme">
        {t("project_terminal.progress_label", "Generating G-Code...")}
      </small>
      <small className="text-theme-muted">{Math.round(progress)}%</small>
    </div>
<ProgressBar
  now={progress}
  animated
  striped
  variant="success"
  className="gcode-progress"
  style={{ height: 10, borderRadius: 8 }}
/>
    <small className="text-theme-muted d-block mt-2">
      {t(
        "project_terminal.progress_hint",
        "This can take a minute for detailed designs. You can stay on this page.",
      )}
    </small>
  </div>
)}

      <Card.Body
        className="p-0 flex-grow-1 position-relative"
        style={{ backgroundColor: activeView === "report" ? "var(--glass-bg)" : "#090a0f" }}
      >
        {activeView === "3d" && hasSimulation ? (
          <iframe
            title="gcode-3d-preview"
            src={project.simulation_file_url}
            className="position-absolute inset-0 w-100 h-100 border-0"
            style={{ backgroundColor: "#fff" }}
          />
        ) : activeView === "report" && hasReport ? (
          <div className="position-absolute inset-0">
            <MachiningReport project={project} />
          </div>
        ) : (
          <div
            className="position-absolute inset-0 p-4 overflow-auto gcode-terminal"
            style={{
              color: gcodePreview ? "#4caf50" : "rgba(255,255,255,0.3)",
              whiteSpace: "pre-wrap",
              direction: "ltr",
              textAlign: "left",
            }}
          >
            {project?.status === "processing" && isGenerating
              ? t("project_terminal.status_processing")
              : gcodePreview || t("project_terminal.awaiting_command")}
          </div>
        )}
      </Card.Body>
    </Card>

    {/* Fullscreen modal: same iframe, blown up to fill the viewport */}
    <Modal
      show={showFullscreen}
      onHide={() => setShowFullscreen(false)}
      fullscreen
      contentClassName="border-0"
    >
      <div
        className="d-flex align-items-center justify-content-between px-4 py-3"
        style={{ backgroundColor: "#090a0f", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="d-flex align-items-center gap-2 text-white fw-bold">
          <FiBox className="text-primary" /> {t("project_terminal.tab_3d")}
        </div>
        <Button
          variant="outline-light"
          size="sm"
          onClick={() => setShowFullscreen(false)}
          className="d-flex align-items-center gap-1"
        >
          <FiX size={16} /> {t("project_terminal.close")}
        </Button>
      </div>
      <Modal.Body className="p-0" style={{ backgroundColor: "#090a0f" }}>
        {hasSimulation && showFullscreen && (
          <iframe
            title="gcode-3d-preview-fullscreen"
            src={project.simulation_file_url}
            className="position-absolute inset-0 w-100 h-100 border-0"
            style={{ backgroundColor: "#fff" }}
          />
        )}
      </Modal.Body>
    </Modal>
    </>
  );
};