import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle } from "react-icons/fi";

/**
 * ConfirmDeleteModal
 * مودال تأكيد حذف عام — يدعم عربي/إنجليزي + Dark/Light + Responsive
 *
 * Props:
 * - show: boolean
 * - title?: string          // اختياري، وإلا يستخدم الترجمة الافتراضية
 * - message?: string        // اختياري
 * - confirmLabel?: string   // نص زر الحذف
 * - cancelLabel?: string
 * - isLoading?: boolean
 * - onConfirm: () => void
 * - onCancel: () => void
 * - itemName?: string       // اسم العنصر (مشروع / صورة...) يظهر في الرسالة
 */
export const ConfirmDeleteModal = ({
  show,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isLoading = false,
  onConfirm,
  onCancel,
  itemName,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const modalTitle = title || t("confirm_delete_modal.title");
  const modalMessage =
    message ||
    (itemName
      ? t("confirm_delete_modal.message_with_name", { name: itemName })
      : t("confirm_delete_modal.message"));
  const btnConfirm = confirmLabel || t("confirm_delete_modal.confirm");
  const btnCancel = cancelLabel || t("confirm_delete_modal.cancel");

  return (
    <Modal
      show={show}
      onHide={isLoading ? undefined : onCancel}
      centered
      backdrop="static"
      keyboard={!isLoading}
      contentClassName="border-0 shadow-lg"
      dialogClassName="modal-dialog-responsive"
    >
      <Modal.Header
        className="border-0 pb-0"
        style={{ position: "relative" }}
      >
        {/* زر الإغلاق — دائماً على اليسار في الوضع العربي ليبقى مريحاً */}
        {!isLoading && (
          <button
            type="button"
            className="btn-close"
            onClick={onCancel}
            aria-label={t("confirm_delete_modal.close")}
            style={{
              position: "absolute",
              top: "1rem",
              left: isRtl ? "1rem" : "auto",
              right: isRtl ? "auto" : "1rem",
              margin: 0,
              zIndex: 2,
            }}
          />
        )}

        <Modal.Title className="d-flex align-items-center gap-2 fs-6 fw-bold w-100 pe-4">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 36,
              height: 36,
              backgroundColor: "rgba(220, 53, 69, 0.12)",
              color: "#dc3545",
              flexShrink: 0,
            }}
          >
            <FiAlertTriangle size={18} />
          </span>
          <span>{modalTitle}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3">
        <p
          className="text-theme-muted mb-0"
          style={{ lineHeight: 1.7, fontSize: "0.95rem" }}
        >
          {modalMessage}
        </p>

        <div
          className="mt-3 p-3 rounded-4"
          style={{
            backgroundColor: "rgba(220, 53, 69, 0.06)",
            border: "1px solid rgba(220, 53, 69, 0.2)",
          }}
        >
          <small className="text-danger fw-semibold d-block">
            {t("confirm_delete_modal.warning")}
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer
        className="border-0 pt-2 gap-2"
        style={{
          flexDirection: isRtl ? "row-reverse" : "row",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="fw-bold px-4"
        >
          {btnCancel}
        </Button>

        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={isLoading}
          className="fw-bold px-4 d-flex align-items-center gap-2"
        >
          {isLoading && <Spinner animation="border" size="sm" />}
          {btnConfirm}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};