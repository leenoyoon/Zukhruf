import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiTarget, FiGitBranch, FiTool } from "react-icons/fi";
import "./style.css";

export const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FiTarget size={28} />,
      title: t("home.feature_offset_title", "Adaptive Offsetting"),
      desc: t(
        "home.feature_offset_desc",
        "Toolpaths follow the true width of your ornament — wide areas get more passes, narrow areas stay safe.",
      ),
    },
    {
      icon: <FiGitBranch size={28} />,
      title: t("home.feature_arcs_title", "Clean Arc Paths"),
      desc: t(
        "home.feature_arcs_desc",
        "Curves are fitted to G2/G3 arcs instead of dense zigzag G1 segments.",
      ),
    },
    {
      icon: <FiTool size={28} />,
      title: t("home.feature_coverage_title", "Coverage Preview"),
      desc: t(
        "home.feature_coverage_desc",
        "Check tool reach before you carve, and switch diameter when thin details need it.",
      ),
    },
  ];

  return (
    <Container className="stats-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="modern-card border-0 py-4 px-2 shadow-lg stats-card">
          <Row className="text-center g-4">
            {features.map((f, idx) => (
              <Col
                md={4}
                key={idx}
                className={
                  idx < features.length - 1
                    ? "border-end border-secondary border-opacity-25"
                    : ""
                }
              >
                <div className="stats-number mb-2 d-flex justify-content-center">
                  {f.icon}
                </div>
                <h5 className="fw-bold text-theme mb-2">{f.title}</h5>
                <p
                  className="text-theme-muted mb-0 px-2"
                  style={{ fontSize: "0.9rem", lineHeight: 1.5 }}
                >
                  {f.desc}
                </p>
              </Col>
            ))}
          </Row>
        </Card>
      </motion.div>
    </Container>
  );
};