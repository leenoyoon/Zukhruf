import React from "react";
import { Col, Card, Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { FiUser, FiLock, FiMail, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRegister } from "../../hooks/useRegister";
import "./style.css";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formData, loading, handleChange, handleRegister } = useRegister();

  return (
    <Col
      xs={12}
      lg={6}
      className="d-flex align-items-center justify-content-center p-4 position-relative"
    >
      <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 z-n1 pointer-events-none">
        <div className="register-blur-circle" />
      </div>

      <Card
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-0 bg-transparent w-100 position-relative"
        style={{ maxWidth: "420px" }}
      >
        <Card.Body className="p-0 mt-4">
          <div className="d-flex d-lg-none align-items-center gap-2 mb-5 justify-content-center mt-3">
            <div
              className="p-2 rounded-circle shadow-sm"
              style={{
                background: "linear-gradient(135deg, #FF6B00 0%, #FFB067 100%)",
              }}
            >
              <FiZap size={20} color="white" />
            </div>
            <h3 className="mb-0 fw-black text-theme">{t("nav.brand_name")}</h3>
          </div>

          <div className="mb-5 text-center text-lg-start">
            <h2 className="fw-black text-theme mb-2">
              {t("auth.register_title", "Create Account")}
            </h2>
            <p className="text-theme-muted fw-bold">
              {t(
                "auth.register_subtitle",
                "Sign up now to start creating your CNC projects.",
              )}
            </p>
          </div>

          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-4">
              <Form.Label className="text-theme fw-bold small">
                {t("auth.username", "Username")}
              </Form.Label>
              <InputGroup
                className="rounded-3 overflow-hidden"
                style={{ border: "1px solid var(--glass-border)" }}
              >
                <InputGroup.Text className="px-3 bg-transparent register-icon-style">
                  <FiUser size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t("auth.choose_username", "Choose a username")}
                  required
                  className="auth-input py-3 border-0 bg-transparent"
                  style={{ color: "var(--text-main)", boxShadow: "none" }}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-theme fw-bold small">
                {t("auth.email", "Email Address")}{" "}
                <span className="opacity-50 fw-normal">
                  {t("auth.optional", "(Optional)")}
                </span>
              </Form.Label>
              <InputGroup
                className="rounded-3 overflow-hidden"
                style={{ border: "1px solid var(--glass-border)" }}
              >
                <InputGroup.Text className="px-3 bg-transparent register-icon-style">
                  <FiMail size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("auth.email_placeholder", "Enter your email")}
                  className="auth-input py-3 border-0 bg-transparent"
                  style={{ color: "var(--text-main)", boxShadow: "none" }}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-theme fw-bold small">
                {t("auth.password", "Password")}
              </Form.Label>
              <InputGroup
                className="rounded-3 overflow-hidden"
                style={{ border: "1px solid var(--glass-border)" }}
              >
                <InputGroup.Text className="px-3 bg-transparent register-icon-style">
                  <FiLock size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("auth.create_password", "Create a password")}
                  required
                  className="auth-input py-3 border-0 bg-transparent"
                  style={{ color: "var(--text-main)", boxShadow: "none" }}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-5">
              <Form.Label className="text-theme fw-bold small">
                {t("auth.confirm_password", "Confirm Password")}
              </Form.Label>
              <InputGroup
                className="rounded-3 overflow-hidden"
                style={{ border: "1px solid var(--glass-border)" }}
              >
                <InputGroup.Text className="px-3 bg-transparent register-icon-style">
                  <FiLock size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t(
                    "auth.reenter_password",
                    "Re-enter your password",
                  )}
                  required
                  className="auth-input py-3 border-0 bg-transparent"
                  style={{ color: "var(--text-main)", boxShadow: "none" }}
                />
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              className="btn-primary-custom w-100 py-3 mb-4 fw-bold fs-6 rounded-pill d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? <Spinner size="sm" /> : null}
              {loading
                ? t("auth.creating_account", "Creating account...")
                : t("auth.register_btn", "Register Now")}
            </Button>

            <div className="text-center text-theme-muted fw-bold">
              {t("auth.has_account", "Already have an account?")}{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => navigate("/login")}
              >
                {t("auth.login_link", "Login here")}
              </span>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
};
