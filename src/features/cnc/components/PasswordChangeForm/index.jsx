import React from "react";
import { Card, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { FiLock, FiShield } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./style.css";

export const PasswordChangeForm = ({
  passwords,
  setPasswords,
  loading,
  handlePasswordChange,
}) => {
  const { t } = useTranslation();

  const inputStyle = {
    backgroundColor: "var(--bg-deep)",
    color: "var(--text-main)",
    borderColor: "var(--glass-border)",
  };

  return (
    <Card className="modern-card border-0" data-tour="settings-security">
      <Card.Body className="p-4 p-md-5">
        <h5 className="fw-bold text-theme mb-4 d-flex align-items-center gap-2">
          <FiShield className="text-primary" size={24} />{" "}
          {t("settings.security_title")}
        </h5>

        <Form
          onSubmit={handlePasswordChange}
          className="d-flex flex-column gap-3"
        >
          <Form.Group>
            <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
              <FiLock /> {t("settings.old_password")}
            </Form.Label>
            <Form.Control
              type="password"
              className="password-input p-3 rounded-3"
              style={inputStyle}
              required
              value={passwords.old}
              onChange={(e) =>
                setPasswords({ ...passwords, old: e.target.value })
              }
            />
          </Form.Group>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                  <FiLock /> {t("settings.new_password")}
                </Form.Label>
                <Form.Control
                  type="password"
                  className="password-input p-3 rounded-3"
                  style={inputStyle}
                  required
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                  <FiLock /> {t("settings.confirm_new_password")}
                </Form.Label>
                <Form.Control
                  type="password"
                  className="password-input p-3 rounded-3"
                  style={inputStyle}
                  required
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            disabled={loading}
            className="btn-primary-custom w-100 py-3 mt-3 fw-bold fs-6"
            data-tour="settings-save"
          >
            {loading ? <Spinner size="sm" className="me-2" /> : null}
            {loading ? t("settings.processing") : t("settings.save_changes")}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};
