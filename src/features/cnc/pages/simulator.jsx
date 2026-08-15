import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import { FiPlus, FiCpu } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGcodeUploads } from "../hooks/useGcodeUploads";
import { GcodeUploadForm } from "../components/GcodeUploadForm";
import { GcodeUploadCard } from "../components/GcodeUploadCard";
import { ConfirmDeleteModal } from "../../../shared/components/ConfirmDeleteModal";
const SimulatorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const {
    uploads,
    loading,
    error,
    hasNext,
    loadingMore,
    handleLoadMore,
    handleUpload,
    handleDelete,
    isUploading,
    uploadError,
    setUploadError,
  } = useGcodeUploads();

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
  };

  const onUpload = async (payload) => {
    const created = await handleUpload(payload);
    if (created?.id) {
      setShowForm(false);
      navigate(`/simulator/${created.id}`);
    }
    return created;
  };

const [showDelete, setShowDelete] = useState(false);
const [deleting, setDeleting] = useState(false);
const [selectedId, setSelectedId] = useState(null);

const askDelete = (id) => {
  setSelectedId(id);
  setShowDelete(true);
};

const confirmDelete = async () => {
  if (!selectedId) return;
  setDeleting(true);
  try {
    await handleDelete(selectedId);
    setShowDelete(false);
    setSelectedId(null);
  } finally {
    setDeleting(false);
  }
};
  return (
    <Container className="py-5 mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <h1 className="display-5 fw-black text-theme mb-2">
            {t("simulator.title_1")}{" "}
            <span className="text-primary">{t("simulator.title_2")}</span>
          </h1>
          <p className="text-theme-muted mb-0">{t("simulator.subtitle")}</p>
        </div>
        <Button
          onClick={() => {
            setUploadError("");
            setShowForm(true);
          }}
          className="btn-primary-custom d-flex align-items-center justify-content-center gap-2 px-4 py-2"
        >
          <FiPlus size={20} />
          {t("simulator.btn_upload")}
        </Button>
      </div>

      {/* Modal بدل الفورم المفتوح لتحت */}
      <Modal
        show={showForm}
        onHide={() => !isUploading && setShowForm(false)}
        centered
        size="lg"
        contentClassName="modern-card border-0"
      >
        <Modal.Header
          closeButton={!isUploading}
          className="border-0 pb-0"
          style={{ background: "var(--bg-surface)", color: "var(--text-main)" }}
        >
          <Modal.Title className="fw-bold text-theme">
            {t("simulator.upload_title")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ background: "var(--bg-surface)" }}
          className="pt-2"
        >
          <GcodeUploadForm
            onSubmit={onUpload}
            isUploading={isUploading}
            uploadError={uploadError}
            onClearError={() => setUploadError("")}
            hideTitle
          />
        </Modal.Body>
      </Modal>

      {loading ? (
        <div className="d-flex justify-content-center py-5 my-5">
          <Spinner animation="grow" style={{ color: "var(--primary-orange)" }} />
        </div>
      ) : error ? (
        <Card className="modern-card border-0 p-4 text-center">
          <p className="text-danger mb-2">{error}</p>
          <small className="text-theme-muted">
            Check Network tab → request to <code>gcode-uploads/</code>
          </small>
        </Card>
      ) : uploads.length === 0 ? (
        <Card
          className="text-center p-5 modern-card border-0 my-4"
          style={{
            backgroundColor: "transparent",
            border: "1px dashed var(--glass-border) !important",
          }}
        >
          <Card.Body className="py-5">
            <FiCpu size={60} className="text-theme-muted mb-3 opacity-50" />
            <h4 className="text-theme fw-bold">
              {t("simulator.no_uploads_title")}
            </h4>
            <p className="text-theme-muted mb-0">
              {t("simulator.no_uploads_desc")}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="g-4">
            <AnimatePresence>
              {uploads.map((u) => (
                <GcodeUploadCard
                  key={u.id}
                  upload={u}
                  fadeUpVariant={fadeUpVariant}
                  onDelete={askDelete}
                />
              ))}
            </AnimatePresence>
          </Row>

          {hasNext && (
            <div className="text-center mt-4">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn-primary-custom px-4"
              >
                {loadingMore ? <Spinner size="sm" /> : t("simulator.load_more")}
              </Button>
            </div>
          )}
        </>
      )}
      <ConfirmDeleteModal
  show={showDelete}
  isLoading={deleting}
  onConfirm={confirmDelete}
  onCancel={() => {
    if (!deleting) {
      setShowDelete(false);
      setSelectedId(null);
    }
  }}
/>
    </Container>
  );
};

export default SimulatorPage;