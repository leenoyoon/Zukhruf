import React from "react";
import { Card, Button } from "react-bootstrap";
import { FiExternalLink, FiMaximize2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./style.css";

export const GcodeSimulationViewer = ({ simulationUrl, title }) => {
  const { t } = useTranslation();

  if (!simulationUrl) {
    return (
      <Card className="modern-card border-0 p-5 text-center">
        <p className="text-theme-muted mb-0">
          {t("simulator.no_simulation")}
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="modern-card border-0 overflow-hidden" data-tour="sim-viewer">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 border-bottom"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <h6 className="fw-bold text-theme mb-0">
            {title || t("simulator.preview_3d")}
          </h6>
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="outline-secondary"
              className="d-flex align-items-center gap-1"
              href={simulationUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FiExternalLink size={14} />
              <span className="d-none d-sm-inline">
                {t("simulator.open_new_tab")}
              </span>
            </Button>
          </div>
        </div>
        <div className="sim-frame-wrap">
          <iframe
            title="gcode-simulation"
            src={simulationUrl}
            className="sim-frame"
            allowFullScreen
          />
        </div>
      </Card>
    </motion.div>
  );
};