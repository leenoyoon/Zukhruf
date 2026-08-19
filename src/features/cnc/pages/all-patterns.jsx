import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiArrowLeft,
  FiUser,
  FiLayers,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAllPatterns } from "../hooks/useAllPatterns";

const AllPatternsPage = () => {
  const { patterns, loading, error, hasNext, isLoadingMore, loadMore } =
    useAllPatterns();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const ArrowIcon = i18n.language === "ar" ? FiArrowLeft : FiArrowRight;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Container className="py-5 mt-4 flex-grow-1">
      <div className="mb-5 position-relative">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <Badge
          data-tour="patterns-header"
            bg="none"
            className="mb-3 px-3 py-2 rounded-pill fw-bold"
            style={{
              border: "1px solid var(--primary-orange)",
              color: "var(--primary-orange)",
              letterSpacing: "1px",
            }}
          >
            <FiLayers className={i18n.language === "ar" ? "ms-2" : "me-2"} />{" "}
            {t("all_patterns.badge")}
          </Badge>
          <h1 className="display-4 fw-black text-theme mb-3">
            {t("all_patterns.title_1")}{" "}
            <span className="text-primary">{t("all_patterns.title_2")}</span>
          </h1>
          <p
            className="text-theme-muted lead mx-auto"
            style={{ maxWidth: "600px" }}
          >
            {t("all_patterns.subtitle")}
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="d-flex flex-column justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <span className="text-theme-muted fw-bold">
            {t("all_patterns.fetching")}
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <h5 className="text-danger fw-bold">{error}</h5>
          <Button
            variant="link"
            className="text-primary"
            onClick={() => window.location.reload()}
          >
            {t("all_patterns.try_again")}
          </Button>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row className="g-4">
              <AnimatePresence>
                {patterns.map((pattern, index) => (
                  <Col xs={12} sm={6} lg={4} xl={3} key={pattern.id}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                      data-tour={index === 0 ? "patterns-card" : undefined}
                        className="modern-card border-0 h-100 overflow-hidden shadow-hover"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          borderRadius: "20px",
                        }}
                      >
                        <div
                          className="position-relative overflow-hidden"
                          style={{ height: "200px" }}
                        >
                          <Card.Img
                            variant="top"
src={pattern.image_file || pattern.image_url}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                          <div className="card-overlay d-flex align-items-center justify-content-center">
                            <Button
                              variant="light"
                              className="rounded-circle p-3 shadow-lg"
                              onClick={() => navigate(`/gallery/${pattern.id}`)}
                            >
                              <FiSearch size={20} className="text-primary" />
                            </Button>
                          </div>
                        </div>

                        <Card.Body className="p-4 d-flex flex-column">
                          <h6 className="fw-bold text-theme mb-2 text-truncate">
                            {pattern.title}
                          </h6>
                          <div className="d-flex align-items-center gap-2 mb-4 text-theme-muted small fw-bold">
                            <FiUser className="text-primary" />{" "}
                            {pattern.uploaded_by_username ||
                              t("all_patterns.artist")}
                          </div>

                          <Button
                                                      data-tour={index === 0 ? "patterns-view" : undefined}

                            className="btn-primary-custom w-100 py-2 mt-auto d-flex justify-content-center align-items-center gap-2"
                            onClick={() => navigate(`/gallery/${pattern.id}`)}
                          >
                            {t("all_patterns.view_details")} <ArrowIcon />
                          </Button>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </AnimatePresence>
            </Row>
          </motion.div>

          {hasNext && (
            <div className="text-center mt-5 pt-4">
              <Button
              data-tour="patterns-load-more"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-5 py-3 fw-black rounded-pill border-0 shadow-lg transition-all"
                style={{
                  background: "var(--bg-surface)",
                  color: "var(--primary-orange)",
                  border: "2px solid var(--primary-orange)",
                  letterSpacing: "1px",
                }}
              >
                {isLoadingMore ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  t("all_patterns.load_more")
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default AllPatternsPage;
