import React from "react";
import { Row } from "react-bootstrap";
import { FiCpu, FiLayers, FiPenTool } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { AuthHero } from "../components/AuthHero";
import { RegisterForm } from "../components/RegisterForm";

const RegisterPage = () => {
  const { t } = useTranslation();

  const heroFeatures = [
    {
      icon: <FiCpu size={24} />,
      text: t("auth.register_feat_1", "Instant G-Code generation"),
    },
    {
      icon: <FiLayers size={24} />,
      text: t("auth.register_feat_2", "Public pattern library"),
    },
    {
      icon: <FiPenTool size={24} />,
      text: t("auth.register_feat_3", "Advanced & easy control interface"),
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
          title={t("auth.register_hero_title", "Start Your Journey")}
          subtitle={t("auth.register_hero_subtitle", "Into Smart Mfg")}
          features={heroFeatures}
        />
        <RegisterForm />
      </Row>
    </div>
  );
};

export default RegisterPage;
