import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./style.css";

export const StatsSection = () => {
  const { t } = useTranslation();

  return (
    <Container className="stats-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="modern-card border-0 py-4 shadow-lg stats-card">
          <Row className="text-center g-4">
            <Col
              md={4}
              className="border-end border-secondary border-opacity-25"
            >
              <h2 className="fw-black text-theme mb-0 stats-number">+5,000</h2>
              <p className="text-theme-muted fw-bold mb-0">
                {t("home.stat_patterns")}
              </p>
            </Col>
            <Col
              md={4}
              className="border-end border-secondary border-opacity-25"
            >
              <h2 className="fw-black text-theme mb-0 stats-number">+12,000</h2>
              <p className="text-theme-muted fw-bold mb-0">
                {t("home.stat_projects")}
              </p>
            </Col>
            <Col md={4}>
              <h2 className="fw-black text-theme mb-0 stats-number">99.9%</h2>
              <p className="text-theme-muted fw-bold mb-0">
                {t("home.stat_accuracy")}
              </p>
            </Col>
          </Row>
        </Card>
      </motion.div>
    </Container>
  );
};
