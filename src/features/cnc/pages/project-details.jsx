import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Stack,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useProjectDetails } from "../hooks/useProjectDetails";

import { ProjectOverview } from "../components/ProjectOverview";
import { ProjectEditForm } from "../components/ProjectEditForm";
import { ProjectTerminal } from "../components/ProjectTerminal";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const {
    project,
    loading,
    error,
    editData,
    setEditData,
    isUpdating,
    isGenerating,
    gcodePreview,
    handleUpdateProject,
    handleDeleteProject,
    handleGenerateGCode,
  } = useProjectDetails(id);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const ArrowIcon = i18n.language === "ar" ? FiArrowRight : FiArrowLeft;

  if (loading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner
          animation="grow"
          style={{ color: "#FF6B00", width: "3rem", height: "3rem" }}
        />
      </Container>
    );

  if (error)
    return (
      <Container className="py-5 mt-5 text-center">
        <Alert variant="danger" className="d-inline-block rounded-4 fw-bold">
          {error || t("project_details.error_not_found")}
        </Alert>
      </Container>
    );

  return (
    <Container className="py-5 mt-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="d-flex justify-content-between align-items-center mb-4"
      >
        <Button
          variant="link"
          onClick={() => navigate("/projects")}
          className="text-theme-muted text-decoration-none p-0 d-flex align-items-center gap-2 fw-bold"
          style={{ transition: "color 0.3s" }}
          onMouseEnter={(e) => (e.target.style.color = "#FF6B00")}
          onMouseLeave={(e) =>
            (e.target.style.color = "var(--text-muted-custom)")
          }
        >
          <ArrowIcon size={20} /> {t("project_details.back_to_projects")}
        </Button>

        <Button
          variant="link"
          onClick={() => {
            if (window.confirm(t("project_details.confirm_delete"))) {
              handleDeleteProject();
            }
          }}
          className="text-danger text-decoration-none p-0 d-flex align-items-center gap-2 fw-bold opacity-75 hover-opacity-100"
        >
          <FiTrash2 size={20} /> {t("project_details.delete_project")}
        </Button>
      </motion.div>

      <Row className="g-4">
        <Col
          xs={12}
          lg={4}
          as={motion.div}
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
        >
          <Stack gap={4}>
            <ProjectOverview project={project} />
            <ProjectEditForm
              editData={editData}
              setEditData={setEditData}
              isUpdating={isUpdating}
              handleUpdateProject={handleUpdateProject}
            />
          </Stack>
        </Col>

        <Col
          xs={12}
          lg={8}
          as={motion.div}
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
        >
          <ProjectTerminal
            project={project}
            isGenerating={isGenerating}
            gcodePreview={gcodePreview}
            handleGenerateGCode={handleGenerateGCode}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetailsPage;
