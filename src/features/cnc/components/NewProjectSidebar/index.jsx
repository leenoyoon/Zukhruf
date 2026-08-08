import React from "react";
import { Col, Card, Form, Button, Row, Spinner } from "react-bootstrap";
import {
  FiUploadCloud,
  FiSettings,
  FiTrash2,
  FiCpu,
  FiCheckCircle,
  FiZap // أيقونة الطاقة الجديدة
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next"; 
import { CoverageConfirmModal } from "../CoverageConfirmModal";
import {
  MIN_WOOD_DIMENSION_MM,
  isValidWoodDimension,
} from "../../../../shared/utils/woodDimensions";
import "./style.css";

export const NewProjectSidebar = ({ hookData, fadeUpVariant }) => {
  const { t } = useTranslation(); 
  
  const {
    file,
    isUploading,
    isLoadingExisting,
    imageDetails,
    setImageDetails,
    uploadedImageId,
    isCreatingProject,
    dimensions,
    setDimensions,
    createdProjectId,
    toolDiaMm,
    setToolDiaMm,
    isAnalyzing,
    handleAIPreview,
    onDrop,
    handleUpload,
    handleCreateProject,
    resetFile,
    coverageInfo,
    showCoverageModal,
    isCheckingCoverage,
    handleAcceptSuggestedTool,
    handleDeclineSuggestedTool,
    handleCancelCreation,
  } = hookData;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".svg"] },
    multiple: false,
  });

  // Wood width (X) / height (Y) must each be at least MIN_WOOD_DIMENSION_MM.
  // Computed once here so both the field styling and the button `disabled`
  // checks below stay in sync with each other.
  const isWidthInvalid = !isValidWoodDimension(dimensions.x);
  const isHeightInvalid = !isValidWoodDimension(dimensions.y);
  const hasInvalidDimensions = isWidthInvalid || isHeightInvalid;

  const inputStyle = {
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-main)",
    borderColor: "var(--glass-border)",
  };

  return (
    <Col
      xs={12}
      lg={4}
      as={motion.div}
      variants={fadeUpVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="d-flex flex-column gap-4">
        <AnimatePresence mode="wait">
          {isLoadingExisting && !file ? (
            <motion.div
              key="loading-existing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 rounded-4 text-center"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "2px dashed var(--glass-border)",
              }}
            >
              <Spinner size="sm" className="mb-2" />
              <p className="text-theme-muted small mb-0">
                {t("new_project_sidebar.loading_existing")}
              </p>
            </motion.div>
          ) : !file ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              {...getRootProps()}
              className={`p-5 rounded-4 text-center cursor-pointer transition-all ${isDragActive ? "border-primary" : "border-secondary"}`}
              style={{
                backgroundColor: isDragActive
                  ? "rgba(255, 107, 0, 0.08)"
                  : "var(--glass-bg)",
                border: `2px dashed ${isDragActive ? "var(--primary-orange)" : "var(--glass-border)"}`,
              }}
            >
              <input {...getInputProps()} />
              <FiUploadCloud
                size={60}
                className={`mb-3 ${isDragActive ? "text-primary" : "text-theme-muted opacity-50"}`}
              />
              <h5 className="fw-bold text-theme">{t("new_project_sidebar.drag_drop")}</h5>
              <p className="text-theme-muted small mb-0 mt-2">
                {t("new_project_sidebar.or")} <span className="text-primary fw-bold">{t("new_project_sidebar.browse")}</span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file-info"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 rounded-4 d-flex align-items-center gap-3"
              style={{
                backgroundColor: "rgba(255, 107, 0, 0.05)",
                border: "1px solid rgba(255, 107, 0, 0.3)",
              }}
            >
              <img
                src={file.preview}
                alt="preview"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />
              <div className="flex-grow-1 overflow-hidden">
                <h6 className="fw-bold text-theme mb-0 text-truncate">
                  {file.name}
                </h6>
                <small className="text-theme-muted">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </small>
              </div>
              <Button
                variant="link"
                className="p-0 text-danger"
                onClick={resetFile}
                disabled={isUploading || createdProjectId}
              >
                <FiTrash2 size={22} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="modern-card border-0">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <FiSettings size={22} className="text-primary" />
              <h5 className="fw-bold text-theme mb-0">{t("new_project_sidebar.step1_title")}</h5>
            </div>
            <Form className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("new_project_sidebar.image_title")}
                </Form.Label>
                <Form.Control
                  className="custom-input p-2 rounded-3"
                  style={inputStyle}
                  value={imageDetails.title}
                  onChange={(e) =>
                    setImageDetails({ ...imageDetails, title: e.target.value })
                  }
                  disabled={isUploading || uploadedImageId}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("new_project_sidebar.description")}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="custom-input p-2 rounded-3"
                  style={inputStyle}
                  value={imageDetails.description}
                  onChange={(e) =>
                    setImageDetails({
                      ...imageDetails,
                      description: e.target.value,
                    })
                  }
                  disabled={isUploading || uploadedImageId}
                />
              </Form.Group>
              <Form.Group className="mt-2 custom-switch">
                <Form.Check
                  type="switch"
                  id="pattern-switch"
                  label={
                    <span className="text-theme fw-bold">
                      {t("new_project_sidebar.save_pattern")}
                    </span>
                  }
                  checked={imageDetails.is_pattern}
                  onChange={(e) =>
                    setImageDetails({
                      ...imageDetails,
                      is_pattern: e.target.checked,
                    })
                  }
                  disabled={isUploading || uploadedImageId}
                />
              </Form.Group>
              {!uploadedImageId && (
                <Button
                  disabled={!file || isUploading || uploadedImageId}
                  onClick={handleUpload}
                  className="btn-primary-custom w-100 py-3 mt-2 fw-bold"
                >
                  {isUploading ? t("new_project_sidebar.uploading") : t("new_project_sidebar.upload_btn")}
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>

        <Card
          className="modern-card border-0 transition-all"
          style={{
            opacity: uploadedImageId ? 1 : 0.4,
            pointerEvents: uploadedImageId ? "auto" : "none",
          }}
        >
          <Card.Body className="p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <FiCpu size={22} className="text-success" />
              <h5 className="fw-bold text-theme mb-0">{t("new_project_sidebar.step2_title")}</h5>
            </div>
            <Form className="d-flex flex-column gap-3">
              <Row className="g-2">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="text-theme fw-bold small">
                      {t("new_project_sidebar.width_x")}
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min={MIN_WOOD_DIMENSION_MM}
                      className="custom-input"
                      style={{ ...inputStyle, direction: 'ltr' }}
                      value={dimensions.x}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, x: e.target.value })
                      }
                      isInvalid={isWidthInvalid}
                      disabled={createdProjectId}
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("new_project_sidebar.min_dimension_error", {
                        min: MIN_WOOD_DIMENSION_MM,
                      })}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label className="text-theme fw-bold small">
                      {t("new_project_sidebar.height_y")}
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min={MIN_WOOD_DIMENSION_MM}
                      className="custom-input"
                      style={{ ...inputStyle, direction: 'ltr' }}
                      value={dimensions.y}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, y: e.target.value })
                      }
                      isInvalid={isHeightInvalid}
                      disabled={createdProjectId}
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("new_project_sidebar.min_dimension_error", {
                        min: MIN_WOOD_DIMENSION_MM,
                      })}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("new_project_sidebar.safe_z")}
                </Form.Label>
                <Form.Control
                  type="number"
                  className="custom-input"
                  style={{ ...inputStyle, direction: 'ltr' }}
                  value={dimensions.z}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, z: e.target.value })
                  }
                  disabled={createdProjectId}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("new_project_sidebar.tool_diameter")}
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="custom-input"
                  style={{ ...inputStyle, direction: 'ltr' }}
                  value={toolDiaMm}
                  onChange={(e) => setToolDiaMm(e.target.value)}
                  disabled={createdProjectId}
                />
                <Form.Text className="text-theme-muted">
                  {t("new_project_sidebar.tool_diameter_hint")}
                </Form.Text>
              </Form.Group>

              {/* Runs ai-visualize/ with the chosen dimensions + tool diameter
                  BEFORE creating the project, so coverage/auto-switch info
                  (shown in NewProjectPreview) is visible while it's still
                  cheap to change the tool diameter above and try again. */}
              <Button
                variant="outline-light"
                disabled={isAnalyzing || createdProjectId || hasInvalidDimensions}
                onClick={handleAIPreview}
                className="w-100 py-2 fw-bold d-flex justify-content-center align-items-center gap-2"
                style={{
                  borderColor: "var(--glass-border)",
                  color: "var(--text-main)",
                }}
              >
                {isAnalyzing ? (
                  <Spinner size="sm" />
                ) : (
                  <FiZap size={16} />
                )}
                {isAnalyzing
                  ? t("new_project_sidebar.analyzing")
                  : t("new_project_sidebar.preview_ai")}
              </Button>

              <Button
                disabled={
                  isCreatingProject ||
                  isCheckingCoverage ||
                  createdProjectId ||
                  !uploadedImageId ||
                  hasInvalidDimensions
                }
                onClick={handleCreateProject}
                className="w-100 py-3 mt-2 fw-bold d-flex justify-content-center align-items-center gap-2"
                style={{
                  background: createdProjectId
                    ? "#198754"
                    : "linear-gradient(135deg, #20c997 0%, #198754 100%)",
                  border: "none",
                  color: "white",
                  boxShadow: createdProjectId
                    ? "none"
                    : "0 8px 20px rgba(25, 135, 84, 0.3)",
                  borderRadius: "12px",
                }}
              >
                {isCheckingCoverage ? (
                  <>
                    <Spinner size="sm" /> {t("new_project_sidebar.checking_coverage")}
                  </>
                ) : isCreatingProject ? (
                  t("new_project_sidebar.creating")
                ) : createdProjectId ? (
                  <>
                    <FiCheckCircle size={20} /> {t("new_project_sidebar.project_created")}
                  </>
                ) : (
                  t("new_project_sidebar.create_project")
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>

      <CoverageConfirmModal
        show={showCoverageModal}
        coverage={coverageInfo}
        isSubmitting={isCreatingProject}
        onAccept={handleAcceptSuggestedTool}
        onDecline={handleDeclineSuggestedTool}
        onCancel={handleCancelCreation}
      />
    </Col>
  );
};