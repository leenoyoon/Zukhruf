import React from "react";
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
            {t("image_details.uploaded_on")}{" "}
            {new Date(imageDetails.created_at || Date.now()).toLocaleDateString(
              i18n.language === "ar" ? "ar-EG" : "en-GB",
            )}
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
                onClick={() =>
                  navigate("/new-project", {
                    state: {
                      selectedImageId: imageDetails.id,
                      selectedImageUrl: imageDetails.image_url,
                    },
                  })
                }
                className="btn-primary-custom py-3 d-flex justify-content-center align-items-center gap-2 fs-5"
              >
                <FiPlay size={22} /> {t("image_details.btn_start_project")}
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
