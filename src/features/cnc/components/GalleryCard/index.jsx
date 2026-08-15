import React, { useState } from "react";
import {
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiPlay, FiEye } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { projectService } from "../../services/projectService";
import "./style.css";

// Same defaults ImageInfoPanel uses when starting a project straight from
// an existing gallery image -- the user can still tweak everything
// (width/height/safe-Z/tool) on the project details page before hitting
// GENERATE, so there's no need to ask for them here.
const DEFAULT_DIMENSIONS = { x: 100, y: 100, z: 10 };

export const GalleryCard = ({ img, fadeUpVariant, onDelete }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isStarting, setIsStarting] = useState(false);

  // This image already exists in the library -- there's nothing to
  // upload. Instead of routing through /new-project (which expects a
  // fresh File it never has for an existing image), create the CNC
  // project directly against this image's id and jump straight to that
  // project's details page, exactly like ImageInfoPanel's "Start CNC
  // Project" button does from the image-details page.
  const handleQuickGenerate = async (e) => {
    e.stopPropagation();
    if (isStarting) return;
    setIsStarting(true);
    try {
      const response = await projectService.createProject({
        title: `${img.title} - CNC`,
        image: img.id,
        dimension_x: 300,
        dimension_y: 400,
        dimension_z: 3,
      });
      const createdProject = response.data || response;
      navigate(`/project/${createdProject.id}`);
    } catch (err) {
      console.error("Failed to start CNC project:", err);
      toast.error(t("image_details.error_start_project"));
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Col xs={12} sm={6} lg={3}>
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="h-100"
      >
        <Card
          className="modern-card gallery-card h-100 border-0"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/gallery/${img.id}`)}
        >
          <div className="gallery-card-img-container">
            <Card.Img
              src={img.image_file || img.image_url}
              className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
            />

            {img.is_pattern && (
              <Badge
                bg="primary"
                className="position-absolute top-0 end-0 m-3 px-3 py-2 fw-bold rounded-pill pattern-badge-shadow"
              >
                {t("gallery.badge_pattern")}
              </Badge>
            )}

            <div className="action-overlay position-absolute inset-0 d-flex align-items-center justify-content-center gap-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("gallery.view_details")}</Tooltip>}
              >
                <Button
                  variant="light"
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center btn-action-circle"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/gallery/${img.id}`);
                  }}
                >
                  <FiEye size={20} />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("gallery.generate_gcode")}</Tooltip>}
              >
                <Button
                  variant="primary"
                  disabled={isStarting}
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center btn-play-circle"
                  onClick={handleQuickGenerate}
                >
                  {isStarting ? (
                    <Spinner size="sm" />
                  ) : (
                    <FiPlay size={24} className="ms-1" />
                  )}
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t("gallery.delete_image")}</Tooltip>}
              >
                <Button
                  variant="danger"
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center btn-delete-circle"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(img.id);
                  }}
                >
                  <FiTrash2 size={20} />
                </Button>
              </OverlayTrigger>
            </div>
          </div>

          <Card.Body className="p-3 text-center">
            <Card.Title className="h6 fw-bold text-theme mb-1 text-truncate">
              {img.title}
            </Card.Title>
            <small className="text-theme-muted fw-bold">
              {t("gallery.id_prefix")} #{img.id}
            </small>
          </Card.Body>
        </Card>
      </motion.div>
    </Col>
  );
};
