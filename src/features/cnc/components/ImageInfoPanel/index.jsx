import React, { useMemo } from "react";
import { Col, Card, Badge, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiAlignLeft,
  FiSettings,
  FiPlay,
  FiTrash2,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./style.css";

export const ImageInfoPanel = ({
  imageDetails,
  handleDelete,
  slideRightVariant,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // capture a stable fallback timestamp once at module render time
  const FALLBACK_NOW = useMemo(() => Date.now(), []);

  const formattedDate = useMemo(() => {
    const ts = imageDetails.created_at || FALLBACK_NOW;
    const dt = new Date(ts);
    return dt.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-GB");
  }, [imageDetails.created_at, i18n.language, FALLBACK_NOW]);

  // This image already exists in the library (uploaded or a stock pattern)
  // -- there's no new file to upload. Instead of creating the CNC project
  // immediately with hidden default dimensions, send the user through the
  // same "Step 2: CNC Setup" screen as a brand new upload (/new-project),
  // passing the existing image along via router state so Step 1 is
  // pre-filled and skipped. That way the user can adjust Width/Height/Safe
  // Height, pick a tool diameter, and run "Preview AI Processing" BEFORE
  // the project is actually created.
const handleStartCncProject = () => {
  navigate("/new-project", {
    state: {
      existingImage: {
        id: imageDetails.id,
        title: imageDetails.title,
        description: imageDetails.description,
        is_pattern: imageDetails.is_pattern,
        image_file: imageDetails.image_file,
        image_url: imageDetails.image_url,
      },
    },
  });
};

  return (
    <Col
      xs={12}
      lg={5}
      as={motion.div}
      variants={slideRightVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="d-flex flex-column gap-4">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h2 className="fw-black text-theme display-6 mb-0">
              {imageDetails.title}
            </h2>
            {imageDetails.is_pattern && (
              <Badge
                bg="primary"
                className="px-3 py-2 rounded-pill fw-bold info-panel-badge"
              >
                {t("image_details.badge_pattern")}
              </Badge>
            )}
          </div>

          <div className="text-theme-muted d-flex align-items-center gap-2 mt-3 fw-bold small">
            <FiCalendar size={16} />
            {t("image_details.uploaded_on")} {" "}
            {formattedDate}
          </div>
        </div>

        <Card className="border-0 rounded-4 info-panel-card">
          <Card.Body className="p-4">
            <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <FiAlignLeft size={18} /> {t("image_details.description")}
            </h6>
            <p className="text-theme mb-0 info-panel-desc">
              {imageDetails.description || t("image_details.no_description")}
            </p>
          </Card.Body>
        </Card>

        <Card className="border-0 rounded-4 info-panel-card">
          <Card.Body className="p-4">
            <h6 className="fw-bold text-primary mb-4 d-flex align-items-center gap-2">
              <FiSettings size={18} /> {t("image_details.actions")}
            </h6>

            <div className="d-flex flex-column gap-3">
              <Button
                onClick={handleStartCncProject}
                className="btn-primary-custom py-3 d-flex justify-content-center align-items-center gap-2 fs-5"
              >
                <FiPlay size={22} />
                {t("image_details.btn_start_project")}
              </Button>

              <Button
                variant="outline-danger"
                onClick={handleDelete}
                className="py-3 rounded-3 fw-bold d-flex justify-content-center align-items-center gap-2"
                style={{ borderWidth: "2px" }}
              >
                <FiTrash2 size={20} /> {t("image_details.btn_delete_image")}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Col>
  );
};