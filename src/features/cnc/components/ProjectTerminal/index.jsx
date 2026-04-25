import React from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { FiCode, FiCpu, FiDownload } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./style.css";

export const ProjectTerminal = ({
  project,
  isGenerating,
  gcodePreview,
  handleGenerateGCode,
}) => {
  const { t } = useTranslation();

  return (
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
              border: `2px solid ${project?.gcode_file_url ? "var(--primary-orange)" : "var(--glass-border)"}`,
              color: project?.gcode_file_url
                ? "var(--primary-orange)"
                : "var(--text-muted-custom)",
              borderRadius: "12px",
            }}
            onMouseEnter={(e) => {
              if (project?.gcode_file_url) {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 107, 0, 0.1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(255, 107, 0, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (project?.gcode_file_url) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            <FiDownload size={18} /> {t("project_terminal.btn_download")}
          </Button>
        </div>
      </div>

      <Card.Body
        className="p-0 flex-grow-1 position-relative"
        style={{ backgroundColor: "#090a0f" }}
      >
        <div
          className="position-absolute inset-0 p-4 overflow-auto gcode-terminal"
          style={{
            color: gcodePreview ? "#4caf50" : "rgba(255,255,255,0.3)",
            whiteSpace: "pre-wrap",
            direction: "ltr",
            textAlign: "left",
          }}
        >
          {gcodePreview || t("project_terminal.awaiting_command")}
        </div>
      </Card.Body>
    </Card>
  );
};
