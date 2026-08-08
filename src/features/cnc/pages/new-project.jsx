import React, { useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useNewProject } from "../hooks/useNewProject";
import { NewProjectSidebar } from "../components/NewProjectSidebar";
import { NewProjectPreview } from "../components/NewProjectPreview";

const NewProjectPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const projectLogic = useNewProject();
  const { file, aiData, isAnalyzing, initFromExistingImage } = projectLogic;

  // Arriving here from an existing image's "Start Project" button (gallery /
  // pattern library) sends the image along via router state instead of
  // making the user drag & drop a file they already have. Load it once so
  // Step 1 is pre-filled and the user lands straight on Step 2 (CNC Setup).
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    if (location.state?.existingImage) {
      didInit.current = true;
      initFromExistingImage(location.state.existingImage);
    }
  }, [location.state, initFromExistingImage]);

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