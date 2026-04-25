import React from "react";
import { Row } from "react-bootstrap";
import { FiCpu, FiLayers, FiPenTool } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { AuthHero } from "../components/AuthHero";
import { LoginForm } from "../components/LoginForm";

const LoginPage = () => {
  const { t } = useTranslation();

  const heroFeatures = [
    {
      icon: <FiCpu size={24} />,
      text: t("auth.login_feat_1", "Ultra-fast G-Code processing"),
    },
    {
      icon: <FiLayers size={24} />,
      text: t("auth.login_feat_2", "Integrated project management"),
    },
    {
      icon: <FiPenTool size={24} />,
      text: t("auth.login_feat_3", "High precision for all CNC machines"),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-deep)",
        overflowX: "hidden",
      }}
    >
      <Row className="m-0 min-vh-100">
        <AuthHero
          title={t("auth.login_hero_title", "Turn Your Imagination")}
          subtitle={t("auth.login_hero_subtitle", "Into Reality")}
          features={heroFeatures}
        />
        <LoginForm />
      </Row>
    </div>
  );
};

export default LoginPage;
