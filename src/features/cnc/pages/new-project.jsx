import React from "react";
import { Container, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNewProject } from "../hooks/useNewProject";
import { NewProjectSidebar } from "../components/NewProjectSidebar";
import { NewProjectPreview } from "../components/NewProjectPreview";

const NewProjectPage = () => {
  const { t } = useTranslation();

  const projectLogic = useNewProject();
  const { file, aiData, isAnalyzing } = projectLogic;

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Container className="py-5 mt-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="display-5 fw-black text-theme mb-4">
          {t("new_project.page_title_1", "Start")}{" "}
          <span className="text-primary">
            {t("new_project.page_title_2", "New Project")}
          </span>
        </h1>
      </motion.div>

      <Row className="g-4">
        <NewProjectSidebar
          hookData={projectLogic}
          fadeUpVariant={fadeUpVariant}
        />

        <NewProjectPreview
          file={file}
          aiData={aiData}
          isAnalyzing={isAnalyzing}
          fadeUpVariant={fadeUpVariant}
        />
      </Row>
    </Container>
  );
};

export default NewProjectPage;
