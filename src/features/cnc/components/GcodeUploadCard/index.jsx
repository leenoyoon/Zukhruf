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
  FiEye,
  FiTrash2,
  FiDownload,
  FiCalendar,
  FiBox,
  FiFileText,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";
import { pickMediaUrl } from "../../../../shared/mediaUrl";
const STATUS_BADGE = {
  completed: { bg: "success", labelKey: "simulator.status_completed" },
  failed: { bg: "danger", labelKey: "simulator.status_failed" },
  processing: { bg: "warning", labelKey: "simulator.status_processing" },
  pending: { bg: "warning", labelKey: "simulator.status_processing" },
};

export const GcodeUploadCard = ({ upload, fadeUpVariant, onDelete }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const statusInfo =
    STATUS_BADGE[upload.status] || { bg: "secondary", labelKey: null };

  const created = upload.created_at
    ? new Date(upload.created_at).toLocaleDateString(
        i18n.language === "ar" ? "ar" : "en",
        { year: "numeric", month: "short", day: "numeric" },
      )
    : "—";

  const simUrl = pickMediaUrl(upload.simulation_file, upload.simulation_file_url);
  const fileUrl = pickMediaUrl(upload.gcode_file, upload.gcode_file_url);

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
        <Card className="modern-card gcode-card h-100 border-0 d-flex flex-column">
          <div
            className="position-relative d-flex align-items-center justify-content-center"
            style={{
              minHeight: 140,
              background:
                "linear-gradient(135deg, rgba(255,107,0,0.12), rgba(255,107,0,0.02))",
              borderBottom: "1px solid var(--glass-border)",
            }}
          >
            <FiFileText size={48} className="text-primary opacity-75" />
            <Badge
              bg={statusInfo.bg}
              className="position-absolute top-0 end-0 m-3 px-3 py-2 fw-bold rounded-pill shadow-sm text-uppercase"
              style={{ letterSpacing: "1px", fontSize: "10px" }}
            >
              {statusInfo.labelKey
                ? t(statusInfo.labelKey)
                : upload.status || t("simulator.status_unknown")}
            </Badge>
          </div>

          <Card.Body className="p-4 d-flex flex-column">
            <Card.Title className="h5 fw-bold text-theme mb-2 text-truncate">
              {upload.title || upload.original_filename || "—"}
            </Card.Title>

            <div className="text-theme-muted small mb-3 d-flex flex-column gap-1">
              <span className="d-flex align-items-center gap-2">
                <FiBox size={14} />
                {upload.wood_width_mm ?? "—"} × {upload.wood_height_mm ?? "—"} mm
              </span>
              <span className="d-flex align-items-center gap-2">
                <FiCalendar size={14} />
                {created}
              </span>
              {upload.processing_info?.line_count != null && (
                <span className="d-flex align-items-center gap-2">
                  <FiFileText size={14} />
                  {t("simulator.line_count", {
                    count: upload.processing_info.line_count,
                  })}
                </span>
              )}
            </div>

            <div className="mt-auto d-flex gap-2 flex-wrap">
              <OverlayTrigger
                overlay={<Tooltip>{t("simulator.view_details")}</Tooltip>}
              >
               <Button
  size="sm"
  className="btn-primary-custom flex-grow-1 d-flex align-items-center justify-content-center gap-1"
  onClick={() => navigate(`/simulator/${upload.id}`)}
>
  <FiEye size={16} />
  <span className="d-none d-sm-inline">
    {t("simulator.view_details")}
  </span>
</Button>
              </OverlayTrigger>
{fileUrl && (
  <OverlayTrigger overlay={<Tooltip>{t("simulator.download")}</Tooltip>}>
    <Button
      type="button"
      variant="light"
      size="sm"
      className="gcode-action-btn gcode-btn-download"
      href={fileUrl}
      target="_blank"
      rel="noreferrer"
    >
      <FiDownload size={16} />
    </Button>
  </OverlayTrigger>
)}

<OverlayTrigger overlay={<Tooltip>{t("simulator.delete")}</Tooltip>}>
  <Button
    type="button"
    variant="light"
    size="sm"
    className="gcode-action-btn gcode-btn-delete"
    onClick={() => onDelete?.(upload.id)}
  >
    <FiTrash2 size={16} />
  </Button>
</OverlayTrigger>
            </div>

            {simUrl && (
              <small className="text-success mt-2 d-block">
                {t("simulator.has_simulation")}
              </small>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </Col>
  );
};