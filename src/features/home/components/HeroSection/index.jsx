import React from "react";
import { Container, Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./style.css";

export const HeroSection = ({ fadeUpVariant }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="position-relative d-flex align-items-center justify-content-center hero-section">
      <div className="position-absolute top-0 start-0 w-100 h-100 z-n1 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hero-mesh-1"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="hero-mesh-2"
        />
      </div>

      <Container className="position-relative z-1 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="d-flex flex-column align-items-center"
        >
          <div className="mb-4 px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2 hero-badge">
            <HiSparkles size={18} /> {t("home.hero_badge")}
          </div>
          <h1 className="fw-black mb-4 text-theme hero-title">
            {t("home.hero_title_1")} <br />
            <span className="hero-title-gradient">
              {t("home.hero_title_2")}
            </span>
          </h1>
          <p
            className="text-theme-muted mb-5 mx-auto h5"
            style={{ maxWidth: "680px", lineHeight: "1.8" }}
          >
            {t("home.hero_desc")}
          </p>
          <Stack
  direction="horizontal"
  gap={3}
  className="justify-content-center flex-wrap"
>
  <Button
    data-tour="home-start"
    onClick={() => navigate("/new-project")}
    className="btn-primary-custom px-5 py-3 h5 mb-0 d-flex align-items-center gap-2 rounded-pill"
    style={{ boxShadow: "0 10px 30px rgba(255, 107, 0, 0.35)" }}
  >
    <FiPlay fill="currentColor" /> {t("home.btn_start")}
  </Button>
  <Button
    data-tour="home-explore"
    onClick={() => navigate("/gallery")}
    className="px-5 py-3 rounded-pill fw-bold h5 mb-0 btn-explore"
  >
    {t("home.btn_explore")}
  </Button>
</Stack>
        </motion.div>
      </Container>
    </section>
  );
};
