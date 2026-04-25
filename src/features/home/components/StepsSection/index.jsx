import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FiUploadCloud, FiCpu, FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./style.css";

export const StepsSection = ({ fadeUpVariant, staggerContainer }) => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <FiUploadCloud size={40} />,
      title: t("home.step1_title", "1. Upload Design"),
      desc: t(
        "home.step1_desc",
        "Upload your image or logo (PNG/JPG) using our drag-and-drop interface.",
      ),
    },
    {
      icon: <FiCpu size={40} />,
      title: t("home.step2_title", "2. Set Dimensions"),
      desc: t(
        "home.step2_desc",
        "Set workpiece dimensions (X, Y) and safe depth (Z) for toolpath processing.",
      ),
    },
    {
      icon: <FiDownload size={40} />,
      title: t("home.step3_title", "3. Download G-Code"),
      desc: t(
        "home.step3_desc",
        "Get a fully compatible (.nc) file for all CNC machines with one click.",
      ),
    },
  ];

  return (
    <Container className="mt-5 pt-5">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariant}
        className="text-center mb-5"
      >
        <h2 className="fw-black h1 text-theme mb-3">
          {t("home.steps_title_1", "How it")}{" "}
          <span className="step-highlight">
            {t("home.steps_title_2", "Works?")}
          </span>
        </h2>
        <p className="text-theme-muted mx-auto" style={{ maxWidth: "600px" }}>
          {t(
            "home.steps_subtitle",
            "Three simple steps between your image and a machine-ready toolpath.",
          )}
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <Row className="g-4 text-center">
          {steps.map((step, idx) => (
            <Col lg={4} key={idx}>
              <motion.div variants={fadeUpVariant} className="h-100">
                <Card className="modern-card h-100 border-0 p-4">
                  <Card.Body>
                    <div className="mb-4 step-icon">{step.icon}</div>
                    <h4 className="fw-bold text-theme mb-3">{step.title}</h4>
                    <p className="text-theme-muted mb-0">{step.desc}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </Container>
  );
};
