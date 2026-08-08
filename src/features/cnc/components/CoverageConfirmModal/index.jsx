import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiSliders, FiArrowRight } from "react-icons/fi";

// The frontend-side answer to AI_Zukhruf/main.py's old CLI prompt:
//   "Switch to the suggested tool diameter Xmm for better coverage? [y/N]"
// check-coverage/ (AI/pipeline.py check_tool_coverage) never switches the
// tool on its own -- it just reports coverage_ok/suggested_tool_mm/message
// so this modal can ask the person directly, instead of the engine
// defaulting to auto_accept_suggested_tool=true and switching silently.
//
// suggested_tool_mm can be null -- that happens when NO tool in the
// backend's list is small enough to cover the fine detail in the design
// (see the `message` field for why). In that case there's nothing to
// "switch" to, so we show the backend's explanation instead and let the
// person choose between creating anyway with the current tool, or
// cancelling to go tweak the design/tool first.
export const CoverageConfirmModal = ({
  show,
  coverage,
  isSubmitting,
  onAccept,
  onDecline,
  onCancel,
}) => {
  const { t } = useTranslation();
  if (!coverage) return null;

  const hasSuggestion = Boolean(coverage.suggested_tool_mm);

  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static">
      <Modal.Header closeButton={!isSubmitting}>
        <Modal.Title className="d-flex align-items-center gap-2 fs-6 fw-bold text-uppercase">
          <FiAlertTriangle className="text-warning" size={20} />
          {t("coverage_modal.title")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-theme-muted mb-4" style={{ lineHeight: 1.6 }}>
          {coverage.message}
        </p>

        {hasSuggestion ? (
          <div
            className="d-flex align-items-center justify-content-between p-3 rounded-4"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--glass-border)",
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

            <FiArrowRight className="text-theme-muted mx-2 flex-shrink-0" size={20} />

            <div className="text-center">
              <small className="text-success text-uppercase d-block mb-1">
                {t("coverage_modal.suggested_tool")}
              </small>
              <div
                className="h4 fw-black text-success mb-0 d-flex align-items-center gap-2 justify-content-center"
                style={{ direction: "ltr" }}
              >
                <FiSliders size={18} />
                {coverage.suggested_tool_mm}mm
              </div>
            </div>
          </div>
        ) : (
          // No smaller tool exists in the backend's list -- there's
          // nothing to switch to, just the current tool and the coverage
          // it falls short by.
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