import React from "react";
import {
  Card,
  Badge,
  Button,
  OverlayTrigger,
  Tooltip,
  Col,
} from "react-bootstrap";
import {
  FiDownload,
  FiTrash2,
  FiEye,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Maps a project's backend status to the Bootstrap badge variant + label
// shown on the card. Kept as an explicit map (instead of the old
// ternary that only distinguished "completed" vs "everything else") so
// "failed" gets its own red/"danger" treatment instead of being lumped
// in with "processing"/"pending" under the same yellow/"warning" color.
const STATUS_BADGE = {
  completed: { bg: "success", labelKey: "projects.status_completed" },
  failed: { bg: "danger", labelKey: "projects.status_failed" },
  processing: { bg: "warning", labelKey: "projects.status_processing_badge" },
  pending: { bg: "warning", labelKey: "projects.status_processing_badge" },
};

export const ProjectCard = ({ project, fadeUpVariant, onDelete }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const statusInfo =
    STATUS_BADGE[project.status] || { bg: "secondary", labelKey: null };

  return (
    <Col xs={12} sm={6} lg={4}>
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="h-100"
      >
        <Card className="modern-card h-100 border-0 d-flex flex-column">
          <div
            className="position-relative"
            style={{ paddingTop: "55%", overflow: "hidden" }}
          >
            <Card.Img
              src={project.image_url}
              alt={project.title}
              className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
            />
            <Badge
              bg={statusInfo.bg}
              className="position-absolute top-0 end-0 m-3 px-3 py-2 fw-bold rounded-pill shadow-sm text-uppercase"
              style={{ letterSpacing: "1px", fontSize: "10px" }}
            >
              {statusInfo.labelKey
                ? t(statusInfo.labelKey)
                : project.status || t("projects.status_unknown")}
            </Badge>
          </div>

          <Card.Body className="p-4 d-flex flex-column">
            <Card.Title className="h5 fw-bold text-theme mb-3 text-truncate">
              {project.title}
            </Card.Title>

            <div className="d-flex flex-column gap-2 mb-4">
              <div className="text-theme-muted small fw-bold d-flex align-items-center gap-2">
                <FiCalendar size={16} className="text-primary" />
                {new Date(project.created_at || 0).toLocaleDateString(
                  i18n.language === "ar" ? "ar-EG" : "en-GB",
                )}
              </div>
              <div
                className="text-theme-muted small fw-bold d-flex align-items-center gap-2"
                style={{
                  direction: "ltr",
                  justifyContent:
                    i18n.language === "ar" ? "flex-end" : "flex-start",
                }}
              >
                <FiClock size={16} className="text-primary" />
                {t("projects.dim")} {project.dimension_x} x{" "}
                {project.dimension_y} x {project.dimension_z} mm
              </div>
            </div>

            <div
              className="d-flex gap-2 mt-auto pt-3 border-top"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("projects.view_details")}</Tooltip>}
              >
                <Button
                  variant="light"
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="d-flex align-items-center justify-content-center p-2 rounded-3"
                  style={{
                    backgroundColor: "var(--bg-deep)",
                    color: "var(--text-main)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <FiEye size={20} />
                </Button>
              </OverlayTrigger>

              <Button
                disabled={!project.gcode_file_url}
                href={project.gcode_file_url}
                target="_blank"
                download
                className="flex-grow-1 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: project.gcode_file_url
                    ? "linear-gradient(135deg, #F47521 0%, #FF914D 100%)"
                    : "var(--bg-deep)",
                  border: "none",
                  color: project.gcode_file_url
                    ? "white"
                    : "var(--text-muted-custom)",
                  boxShadow: project.gcode_file_url
                    ? "0 5px 15px rgba(244, 117, 33, 0.3)"
                    : "none",
                }}
              >
                <FiDownload size={18} />
                {project.gcode_file_url
                  ? t("projects.get_nc")
                  : t("projects.pending")}
              </Button>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("projects.delete_project")}</Tooltip>}
              >
                <Button
                  variant="danger"
                  onClick={() => onDelete(project.id)}
                  className="d-flex align-items-center justify-content-center p-2 rounded-3"
                  style={{
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    color: "#ff4d4d",
                    border: "none",
                  }}
                >
                  <FiTrash2 size={20} />
                </Button>
              </OverlayTrigger>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Col>
  );
};