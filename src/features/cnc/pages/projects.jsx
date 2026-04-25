import React from "react";
import { Container, Row, Button, Card, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiLayers } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "../components/ProjectCard";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    projects,
    loading,
    hasNext,
    loadingMore,
    handleLoadMore,
    handleDelete,
  } = useProjects();

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  return (
    <Container className="py-5 mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
        <div>
          <h1 className="display-5 fw-black text-theme mb-2">
            {t("projects.title_1")}{" "}
            <span className="text-primary">{t("projects.title_2")}</span>
          </h1>
          <p className="text-theme-muted mb-0">{t("projects.subtitle")}</p>
        </div>
        <Button
          onClick={() => navigate("/new-project")}
          className="btn-primary-custom d-flex align-items-center justify-content-center gap-2 px-4 py-2"
        >
          <FiPlus size={20} /> {t("projects.btn_new")}
        </Button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5 my-5">
          <Spinner
            animation="grow"
            style={{ color: "var(--primary-orange)" }}
          />
        </div>
      ) : projects.length === 0 ? (
        <Card
          className="text-center p-5 modern-card border-0 my-4"
          style={{
            backgroundColor: "transparent",
            border: "1px dashed var(--glass-border) !important",
          }}
        >
          <Card.Body className="py-5">
            <FiLayers size={60} className="text-theme-muted mb-3 opacity-50" />
            <h4 className="text-theme fw-bold">
              {t("projects.no_projects_title")}
            </h4>
            <p className="text-theme-muted mb-0">
              {t("projects.no_projects_desc")}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="g-4">
            <AnimatePresence>
              {projects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  fadeUpVariant={fadeUpVariant}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </Row>

          {hasNext && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="d-flex justify-content-center mt-5"
            >
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-5 py-2 rounded-pill fw-bold bg-transparent"
                style={{
                  borderColor: "rgba(255, 107, 0, 0.4)",
                  color: "var(--primary-orange)",
                }}
              >
                {loadingMore
                  ? t("projects.loading")
                  : t("projects.btn_load_more")}
              </Button>
            </motion.div>
          )}
        </>
      )}
    </Container>
  );
};

export default ProjectsPage;
