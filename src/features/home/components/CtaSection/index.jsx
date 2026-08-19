import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";

export const CtaSection = ({ fadeUpVariant }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container className="mt-5 pt-5 mb-3">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariant}
      >
        <Card className="modern-card border-0 p-5 text-center position-relative overflow-hidden cta-card">
          <div className="cta-mesh" />
          <Card.Body className="py-5 position-relative z-1">
            <h2 className="fw-black text-theme mb-3 display-5">
              {t("home.cta_title", "Ready to turn your ideas into reality?")}
            </h2>
            <p
              className="text-theme-muted mb-5 h5"
              style={{ maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}
            >
              {t(
                "home.cta_desc",
                "Join hundreds of engineers and designers who trust Zukhruf for precise CNC toolpaths.",
              )}
            </p>
            <Button
            data-tour="home-cta"
              onClick={() => navigate("/new-project")}
              className="btn-primary-custom px-5 py-3 h4 mb-0 fw-bold rounded-pill"
              style={{ boxShadow: "0 10px 30px rgba(255, 107, 0, 0.3)" }}
            >
              {t("home.btn_create_account", "Start Your First Project Free")}
            </Button>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};
