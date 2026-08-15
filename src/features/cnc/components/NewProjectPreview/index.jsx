import React from "react";
import { Col, Card, Row } from "react-bootstrap";
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
  const { t } = useTranslation();

  const aiResults = aiData;
  const coverage = aiResults?.processing_info?.coverage;
  const report = coverage?.report;

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
                  {Object.entries(aiResults.full_urls || {})
                    .filter(
                      ([key]) =>
                        key !== "simulation_file" && key !== "gcode_file",
                    )
                    .map(([key, url]) => {
                      const isSimulation = key === "simulation_file";
                      const description = aiResults.stage_descriptions?.[key];

                      return (
                        <Col md={4} key={key}>
                          <motion.div
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="p-3 rounded-4 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center text-center"
                            style={{
                              backgroundColor: "var(--bg-surface)",
                              border: "1px solid var(--glass-border)",
                            }}
                          >
                            {isSimulation ? (
                              <FiActivity className="text-info mb-2" size={32} />
                            ) : (
                              <FiTarget className="text-primary mb-2" size={32} />
                            )}

                            <div
                              className="text-capitalize text-theme fw-bold mb-1"
                              style={{ letterSpacing: "0.5px" }}
                            >
                              {key.replace("_", " ")}
                            </div>

                            {description && (
                              <small className="text-theme-muted mb-3">
                                {description}
                              </small>
                            )}

                            {isSimulation ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-info fw-bold"
                              >
                                {t("new_project.open_simulation", "Open Simulation")}
                              </a>
                            ) : (
                              <a
                                href={url}
                                download
                                className="btn btn-sm btn-outline-primary fw-bold"
                              >
                                {t("new_project.download_gcode", "Download G-Code")}
                              </a>
                            )}
                          </motion.div>
                        </Col>
                      );
                    })}
                </Row>

                {report && (
                  <>
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

                      {/* مقارنة التغطية: الأداة المختارة vs المقترحة */}
                      <Row className="g-3 mb-3">
                        {/* الأداة المختارة */}
                        <Col xs={12} md={coverage?.suggested_tool_mm != null ? 6 : 12}>
                          <div
                            className="p-3 rounded-4 text-center h-100 d-flex flex-column justify-content-center"
                            style={{
                              background: "rgba(25, 135, 84, 0.1)",
                              border: "1px solid rgba(25, 135, 84, 0.25)",
                            }}
                          >
                            <div
                              className="h4 fw-bold text-success mb-1 d-flex justify-content-center align-items-center gap-2"
                              style={{ direction: "ltr" }}
                            >
                              <FiSliders size={18} />
                              {coverage.used_tool_mm} mm
                            </div>
                            <small className="text-theme-muted d-block mb-2">
                              {t("new_project.chosen_tool")}
                            </small>
                            <div
                              className="h3 fw-black text-success mb-0"
                              style={{ direction: "ltr" }}
                            >
                              {Number(report.coverage_ratio_percent).toFixed(1)}%
                            </div>
                            <small className="text-success opacity-75">
                              {t("new_project.coverage_percent")}
                            </small>
                          </div>
                        </Col>

                        {/* الأداة المقترحة */}
                        {coverage?.suggested_tool_mm != null && (
                          <Col xs={12} md={6}>
                            <div
                              className="p-3 rounded-4 text-center h-100 d-flex flex-column justify-content-center"
                              style={{
                                background: "rgba(255, 107, 0, 0.08)",
                                border: "1px solid rgba(255, 107, 0, 0.3)",
                              }}
                            >
                              <div
                                className="h4 fw-bold text-warning mb-1 d-flex justify-content-center align-items-center gap-2"
                                style={{ direction: "ltr" }}
                              >
                                <FiSliders size={18} />
                                {coverage.suggested_tool_mm} mm
                              </div>
                              <small className="text-theme-muted d-block mb-2">
                                {t("new_project.suggested_tool")}
                              </small>
                              <div
                                className="h3 fw-black text-warning mb-0"
                                style={{ direction: "ltr" }}
                              >
                                {coverage.suggested_coverage_percent != null
                                  ? `${Number(coverage.suggested_coverage_percent).toFixed(1)}%`
                                  : "≈ 99%+"}
                              </div>
                              <small className="text-warning opacity-75">
                                {t("new_project.coverage_percent")}
                              </small>
                            </div>
                          </Col>
                        )}
                      </Row>

                      {/* باقي الإحصائيات */}
                      <Row className="g-3">
                        <Col xs={6}>
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
                              {(
                                aiResults.processing_info.gcode_report?.points
                                  ?.valid ?? report.output_paths
                              ).toLocaleString()}
                            </div>
                            <small
                              className="text-info opacity-75 fw-bold text-uppercase"
                              style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                            >
                              {t("new_project.est_points")}
                            </small>
                          </div>
                        </Col>

                        <Col xs={6}>
                          <div
                            className="p-3 rounded-4 text-center h-100 d-flex flex-column justify-content-center"
                            style={{
                              background: "rgba(108, 117, 125, 0.1)",
                              border: "1px solid rgba(108, 117, 125, 0.2)",
                            }}
                          >
                            <div
                              className="h3 fw-black text-theme mb-1"
                              style={{ direction: "ltr" }}
                            >
                              {report.unreachable_area_mm2 != null
                                ? Number(report.unreachable_area_mm2).toFixed(1)
                                : "—"}
                            </div>
                            <small
                              className="text-theme-muted fw-bold text-uppercase"
                              style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                            >
                              {t("new_project.unreachable_area")} mm²
                            </small>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* رسالة المحرك */}
                    {coverage?.message && !coverage.coverage_ok && (
                      <div
                        className="mt-3 p-3 rounded-4 d-flex align-items-start gap-2"
                        style={{
                          background: "rgba(255, 107, 0, 0.08)",
                          border: "1px solid rgba(255, 107, 0, 0.3)",
                        }}
                      >
                        <FiSliders className="text-primary flex-shrink-0 mt-1" size={18} />
                        <small className="text-theme fw-bold">
                          {coverage.message}
                        </small>
                      </div>
                    )}

                    {coverage?.switched_tool && (
                      <div
                        className="mt-3 p-3 rounded-4 d-flex align-items-center gap-2"
                        style={{
                          background: "rgba(255, 107, 0, 0.08)",
                          border: "1px solid rgba(255, 107, 0, 0.3)",
                        }}
                      >
                        <FiSliders className="text-primary flex-shrink-0" size={18} />
                        <small className="text-theme fw-bold">
                          {t("new_project.tool_auto_switched", {
                            suggested: coverage.suggested_tool_mm,
                          })}
                        </small>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card.Body>
      </Card>
    </Col>
  );
};