import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Stack,
  Image,
} from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./style.css";

export const PatternsSection = ({
  patterns,
  fadeUpVariant,
  staggerContainer,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const arrowIcon =
    i18n.language === "ar" ? (
      <FaArrowRight className="me-2" style={{ transform: "rotate(180deg)" }} />
    ) : (
      <FaArrowRight className="ms-2" />
    );

  return (
    <Container className="mt-5 pt-5">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3"
      >
        <div>
          <h2 className="fw-black h1 mb-1 text-theme">
            {t("home.patterns_title_1", "Public")}{" "}
            <span className="pattern-highlight">
              {t("home.patterns_title_2", "Patterns")}
            </span>
          </h2>
          <p className="text-theme-muted mb-0">
            {t(
              "home.patterns_desc",
              "Professional and consistent designs from the community.",
            )}
          </p>
        </div>
        <Button
          className="pattern-view-all px-4 py-2 bg-transparent border-0"
          onClick={() => navigate("/patterns")}
        >
          {t("home.btn_view_all", "View All Patterns")} {arrowIcon}
        </Button>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <Row className="g-4">
          {patterns.map((item) => (
            <Col key={item.id} xs={12} sm={6} lg={3}>
              <motion.div variants={fadeUpVariant} className="h-100">
                <Card
                  className="modern-card h-100 cursor-pointer d-flex flex-column"
                  onClick={() => navigate(`/gallery/${item.id}`)}
                >
                  <div className="pattern-img-container">
                    <Card.Img
src={item.image_file || item.image_url}
                      className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                    />
                    {item.is_pattern && (
                      <span className="position-absolute top-0 end-0 m-3 px-3 py-1 fw-bold rounded-pill pattern-badge">
                        {t("home.pattern_badge", "PATTERN")}
                      </span>
                    )}
                  </div>
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="mb-4">
                      <Card.Title className="h5 fw-bold text-theme mb-2 text-truncate">
                        {item.title}
                      </Card.Title>
                      <Card.Text
                        className="text-theme-muted small text-truncate"
                        style={{ opacity: 0.8 }}
                      >
                        {item.description ||
                          t("home.no_description", "No description")}
                      </Card.Text>
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top"
                      style={{ borderColor: "var(--glass-border)" }}
                    >
                      <Stack direction="horizontal" gap={2}>
                        <Image
                          src={`https://ui-avatars.com/api/?name=${item.uploaded_by_username || "U"}&background=FF6B00&color=fff`}
                          roundedCircle
                          width={28}
                        />
                        <span
                          className="fw-bold small text-theme text-truncate"
                          style={{ maxWidth: "80px" }}
                        >
                          @{item.uploaded_by_username || t("home.user", "User")}
                        </span>
                      </Stack>
                      <div
                        className="text-theme-muted small d-flex align-items-center gap-1 fw-bold"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <FiCalendar />
                        {new Date(item.created_at).toLocaleDateString(
                          i18n.language === "ar" ? "ar-EG" : "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </div>
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
