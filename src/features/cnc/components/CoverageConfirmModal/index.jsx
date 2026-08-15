import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiSliders, FiArrowRight } from "react-icons/fi";

export const CoverageConfirmModal = ({
  show,
  coverage,
  isSubmitting,
  onAccept,
  onDecline,
  onCancel,
}) => {
  const { t, i18n } = useTranslation();
  if (!coverage) return null;

  const hasSuggestion = Boolean(coverage.suggested_tool_mm);
  const isRtl = i18n.language === "ar";

  const warningMessage = t("coverage_modal.warning", {
    tool: coverage.used_tool_mm,
    percent: Number(coverage.report?.coverage_ratio_percent ?? 0).toFixed(1),
    area: Number(coverage.report?.unreachable_area_mm2 ?? 0).toFixed(1),
    suggested: coverage.suggested_tool_mm,
  });

  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static">
<Modal.Header
  className="border-0 pb-0"
  style={{ position: "relative" }}
>
  {!isSubmitting && (
    <button
      type="button"
      className="btn-close"
      onClick={onCancel}
      aria-label="Close"
      style={{
        position: "absolute",
        top: "1rem",
        // إنجليزي: يمين | عربي: يسار
        ...(isRtl
          ? { left: "1rem", right: "auto" }
          : { right: "1rem", left: "auto" }),
        margin: 0,
        zIndex: 2,
      }}
    />
  )}

  <Modal.Title
    className="d-flex align-items-center gap-2 fs-6 fw-bold w-100"
    style={{
      // مسافة حتى ما يغطي الزر على النص
      paddingInlineEnd: "2rem",
    }}
  >
    <FiAlertTriangle className="text-warning flex-shrink-0" size={20} />
    <span>{t("coverage_modal.title")}</span>
  </Modal.Title>
</Modal.Header>

      <Modal.Body>
        <p className="text-theme-muted mb-4" style={{ lineHeight: 1.6 }}>
          {hasSuggestion
            ? warningMessage
            : t("coverage_modal.no_suggestion", {
                tool: coverage.used_tool_mm,
                percent: Number(
                  coverage.report?.coverage_ratio_percent ?? 0,
                ).toFixed(1),
              })}
        </p>

        {hasSuggestion ? (
          <div
            className="d-flex align-items-center justify-content-between p-3 rounded-4"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--glass-border)",
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
          >
            <div className="text-center">
              <small className="text-theme-muted text-uppercase d-block mb-1">
                {t("coverage_modal.current_tool")}
              </small>
              <div className="h4 fw-black mb-0" style={{ direction: "ltr" }}>
                {coverage.used_tool_mm}mm
              </div>
            </div>

            <FiArrowRight
              className="text-theme-muted mx-2"
              size={20}
              style={{ transform: isRtl ? "scaleX(-1)" : "none" }}
            />

            <div className="text-center">
              <small className="text-success text-uppercase d-block mb-1">
                {t("coverage_modal.suggested_tool")}
              </small>
              <div
                className="h4 fw-black text-success mb-0 d-flex align-items-center justify-content-center gap-1"
                style={{ direction: "ltr" }}
              >
                <FiSliders size={16} />
                {coverage.suggested_tool_mm}mm
              </div>
            </div>
          </div>
        ) : (
          <div
            className="d-flex align-items-center justify-content-between p-3 rounded-4"
            style={{
              backgroundColor: "rgba(220, 53, 69, 0.08)",
              border: "1px solid rgba(220, 53, 69, 0.3)",
            }}
          >
            <div className="text-center flex-grow-1">
              <small className="text-theme-muted text-uppercase d-block mb-1">
                {t("coverage_modal.current_tool")}
              </small>
              <div className="h4 fw-black mb-0" style={{ direction: "ltr" }}>
                {coverage.used_tool_mm}mm
              </div>
            </div>
            <div className="text-center flex-grow-1">
              <small className="text-danger text-uppercase d-block mb-1">
                {t("coverage_modal.coverage_percent")}
              </small>
              <div
                className="h4 fw-black text-danger mb-0"
                style={{ direction: "ltr" }}
              >
                {coverage.report?.coverage_ratio_percent?.toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        {hasSuggestion ? (
          <>
            <Button
              variant="outline-secondary"
              onClick={onDecline}
              disabled={isSubmitting}
              className="fw-bold"
            >
              {t("coverage_modal.keep_current", { mm: coverage.used_tool_mm })}
            </Button>
            <Button
              onClick={onAccept}
              disabled={isSubmitting}
              className="btn-primary-custom fw-bold d-flex align-items-center gap-2"
            >
              {isSubmitting && <Spinner size="sm" />}
              {t("coverage_modal.switch_to", { mm: coverage.suggested_tool_mm })}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              className="fw-bold"
            >
              {t("coverage_modal.cancel_and_edit")}
            </Button>
            <Button
              variant="danger"
              onClick={onDecline}
              disabled={isSubmitting}
              className="fw-bold d-flex align-items-center gap-2"
            >
              {isSubmitting && <Spinner size="sm" />}
              {t("coverage_modal.create_anyway")}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};