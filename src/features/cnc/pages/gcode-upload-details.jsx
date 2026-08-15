import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  FiArrowLeft,
  FiTrash2,
  FiDownload,
  FiBox,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGcodeUploadDetails } from "../hooks/useGcodeUploadDetails";
import { GcodeSimulationViewer } from "../components/GcodeSimulationViewer";
import { ConfirmDeleteModal } from "../../../shared/components/ConfirmDeleteModal";
import "../components/GcodeUploadCard/style.css";

const GcodeUploadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { upload, loading, error, isDeleting, handleDelete } =
    useGcodeUploadDetails(id);

  // كل الـ Hooks فوق قبل أي return
  const [showDelete, setShowDelete] = useState(false);

  const askDelete = () => setShowDelete(true);

  const confirmDelete = async () => {
    await handleDelete();
  };

  if (loading) {
    return (
      <Container className="py-5 mt-5 d-flex justify-content-center">
        <Spinner animation="grow" style={{ color: "var(--primary-orange)" }} />
      </Container>
    );
  }

  if (error || !upload) {
    return (
      <Container className="py-5 mt-4">
        <Card className="modern-card border-0 p-5 text-center">
          <h4 className="text-theme fw-bold">
            {t("simulator.error_not_found")}
          </h4>
          <Button
            className="btn-primary-custom mt-3"
            onClick={() => navigate("/simulator")}
          >
            {t("simulator.back")}
          </Button>
        </Card>
      </Container>
    );
  }

  const pickMediaUrl = (...candidates) => {
    for (const url of candidates) {
      if (!url) continue;
      if (url.includes("127.0.0.1") || url.includes("localhost")) continue;
      return url.replace(/^http:\/\//i, "https://");
    }
    const fallback = candidates.find(Boolean);
    return fallback ? fallback.replace(/^http:\/\//i, "https://") : null;
  };

  const simUrl = pickMediaUrl(
    upload.simulation_file,
    upload.simulation_file_url
  );
  const fileUrl = pickMediaUrl(upload.gcode_file, upload.gcode_file_url);

  const created = upload.created_at
    ? new Date(upload.created_at).toLocaleString(
        i18n.language === "ar" ? "ar" : "en"
      )
    : "—";

  return (
    <Container className="py-5 mt-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <Button
            variant="link"
            className="text-theme text-decoration-none d-flex align-items-center gap-2 p-0"
            onClick={() => navigate("/simulator")}
          >
            <FiArrowLeft /> {t("simulator.back")}
          </Button>

          <div className="d-flex gap-2 flex-wrap">
            {fileUrl && (
              <Button
                variant="light"
                className="gcode-details-btn gcode-details-btn-download d-flex align-items-center gap-2"
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                <FiDownload size={16} /> {t("simulator.download")}
              </Button>
            )}

            <Button
              variant="light"
              className="gcode-details-btn gcode-details-btn-delete d-flex align-items-center gap-2"
              disabled={isDeleting}
              onClick={askDelete}
            >
              {isDeleting ? <Spinner size="sm" /> : <FiTrash2 size={16} />}
              {t("simulator.delete")}
            </Button>
          </div>
        </div>

        <Row className="g-4">
          <Col xs={12} lg={4}>
            <Card className="modern-card border-0 p-4 h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h3 className="h4 fw-black text-theme mb-0">
                  {upload.title || upload.original_filename}
                </h3>
                <Badge
                  bg={upload.status === "completed" ? "success" : "warning"}
                >
                  {upload.status}
                </Badge>
              </div>

              <ul className="list-unstyled text-theme-muted small d-flex flex-column gap-2 mb-0">
                <li className="d-flex align-items-center gap-2">
                  <FiFileText /> {upload.original_filename || "—"}
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FiBox />
                  {upload.wood_width_mm} × {upload.wood_height_mm} mm
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FiCalendar /> {created}
                </li>
                {upload.processing_info?.line_count != null && (
                  <li className="d-flex align-items-center gap-2">
                    <FiFileText />
                    {t("simulator.line_count", {
                      count: upload.processing_info.line_count,
                    })}
                  </li>
                )}
              </ul>
            </Card>
          </Col>

          <Col xs={12} lg={8}>
            <GcodeSimulationViewer
              simulationUrl={simUrl}
              title={t("simulator.preview_3d")}
            />
          </Col>
        </Row>
      </motion.div>

      <ConfirmDeleteModal
        show={showDelete}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setShowDelete(false)}
      />
    </Container>
  );
};

export default GcodeUploadDetailsPage;