import React, { useState } from "react";
import { Col, Card, Row, Image, Badge, Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FiActivity, FiTarget, FiSliders } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./style.css";

export const NewProjectPreview = ({
  file,
  aiData,
  isAnalyzing,
  fadeUpVariant,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();

  const aiResults = aiData;

  return (
    <Col
      xs={12}
      lg={8}
      as={motion.div}
      variants={fadeUpVariant}
      initial="hidden"
      animate="visible"
    >
      <Card
        className="modern-card border-0 h-100 d-flex flex-column"
        style={{ minHeight: "600px" }}
      >
        <Card.Header className="bg-transparent border-bottom py-3 d-flex justify-content-between align-items-center px-4">
          <span
            className="text-theme-muted fw-black small text-uppercase"
            style={{ letterSpacing: "1px" }}
          >
            {t("new_project.analysis_preview")}
          </span>
          {isAnalyzing && (
            <div className="d-flex align-items-center gap-2 text-warning fw-bold small text-uppercase">
              <div className="spinner-grow spinner-grow-sm" role="status"></div>
              {t("new_project.processing_ai")}
            </div>
          )}
        </Card.Header>

        <Card.Body
          className="p-4 overflow-auto"
          style={{ backgroundColor: "var(--bg-deep)" }}
        >
          <AnimatePresence mode="wait">
            {!aiResults ? (
              <motion.div
                key="initial"
                className="h-100 d-flex flex-column align-items-center justify-content-center text-center"
              >
                {file ? (
                  <img
                    src={file.preview}
                    alt="upload preview"
                    className="img-fluid rounded-4 shadow-lg border border-secondary"
                    style={{ maxHeight: "450px" }}
                  />
                ) : (
                  <div className="text-theme-muted opacity-50 fw-bold">
                    {t("new_project.select_image")}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="d-flex align-items-center mb-4 gap-2">
                  <FiTarget className="text-primary" size={24} />
                  <h5 className="mb-0 fw-bold text-theme">
                    {t("new_project.ai_stages")}
                  </h5>
                </div>

                <Row className="g-3">
                  {Object.entries(aiResults.full_urls || {}).map(
                    ([key, url]) => (
                      <Col md={4} key={key}>
                        <motion.div
                          whileHover={{ scale: 1.03, y: -5 }}
                          className="p-2 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between"
                          style={{
                            backgroundColor: "var(--bg-surface)",
                            border: "1px solid var(--glass-border)",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setSelectedImage({
                              url,
                              title: key.replace("_", " "),
                              description: aiResults.stage_descriptions[key],
                            })
                          }
                        >
                          <Image
                            src={url}
                            fluid
                            className="rounded-3 mb-2 w-100"
                            style={{
                              height: "160px",
                              objectFit: "cover",
                              border: "1px solid rgba(0,0,0,0.1)",
                            }}
                          />
                          <div
                            className="text-capitalize text-theme-muted small text-center fw-bold mt-auto pb-1"
                            style={{ letterSpacing: "0.5px" }}
                          >
                            {key.replace("_", " ")}
                          </div>
                        </motion.div>
                      </Col>
                    ),
                  )}
                </Row>

                {aiResults.statistics && (
                  <div
                    className="mt-5 p-4 rounded-4 shadow-sm"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <div className="d-flex align-items-center mb-4 gap-2">
                      <FiActivity className="text-warning" size={22} />
                      <h6
                        className="fw-bold mb-0 text-theme tracking-wide text-uppercase"
                        style={{ letterSpacing: "1px" }}
                      >
                        {t("new_project.tech_stats")}
                      </h6>
                    </div>

                    <Row className="g-3">
                      <Col xs={4}>
                        <div
                          className="p-3 rounded-4 text-center h-100 d-flex flex-column justify-content-center"
                          style={{
                            background: "rgba(25, 135, 84, 0.1)",
                            border: "1px solid rgba(25, 135, 84, 0.2)",
                          }}
                        >
                          <div
                            className="h3 fw-black text-success mb-1"
                            style={{ direction: "ltr" }}
                          >
                            {aiResults.statistics.processing_stats.cutting_percentage.toFixed(
                              1,
                            )}
                            %
                          </div>
                          <small
                            className="text-success opacity-75 fw-bold text-uppercase"
                            style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                          >
                            {t("new_project.cutting_area")}
                          </small>
                        </div>
                      </Col>

                      <Col xs={4}>
                        <div
                          className="p-3 rounded-4 text-center h-100 d-flex flex-column justify-content-center"
                          style={{
                            background: "rgba(13, 202, 240, 0.1)",
                            border: "1px solid rgba(13, 202, 240, 0.2)",
                          }}
                        >
                          <div
                            className="h3 fw-black text-info mb-1"
                            style={{ direction: "ltr" }}
                          >
                            {aiResults.statistics.processing_stats.estimated_cutting_points.toLocaleString()}
                          </div>
                          <small
                            className="text-info opacity-75 fw-bold text-uppercase"
                            style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                          >
                            {t("new_project.est_points")}
                          </small>
                        </div>
                      </Col>

                      <Col xs={4}>
                        <div
                          className="p-3 rounded-4 text-center h-100 d-flex flex-column justify-content-center"
                          style={{
                            background: "rgba(255, 193, 7, 0.1)",
                            border: "1px solid rgba(255, 193, 7, 0.2)",
                          }}
                        >
                          <div
                            className="h3 fw-black text-warning mb-1 d-flex justify-content-center align-items-center gap-2"
                            style={{ direction: "ltr" }}
                          >
                            <FiSliders size={20} />
                            {aiResults.metadata?.threshold_value || 77}
                          </div>
                          <small
                            className="text-warning opacity-75 fw-bold text-uppercase"
                            style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                          >
                            {t("new_project.threshold")}
                          </small>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card.Body>
      </Card>

      <Modal
        show={!!selectedImage}
        onHide={() => setSelectedImage(null)}
        size="xl"
        centered
        contentClassName="border-0 shadow-lg"
      >
        <div style={{ backgroundColor: "var(--bg-surface)" }}>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="text-capitalize fw-black text-primary">
              {selectedImage?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center pt-2 pb-4">
            <p className="text-theme-muted fw-bold mb-3">
              {selectedImage?.description}
            </p>
            <Image
              src={selectedImage?.url}
              fluid
              className="rounded-3 shadow-lg border border-secondary"
              style={{ maxHeight: "80vh", width: "auto" }}
            />
          </Modal.Body>
        </div>
      </Modal>
    </Col>
  );
};
