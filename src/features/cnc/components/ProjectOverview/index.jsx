import React from "react";
import { Card, Badge } from "react-bootstrap";
import { FiCheckCircle, FiCpu } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export const ProjectOverview = ({ project }) => {
  const { t } = useTranslation();

  if (!project) return null;

  return (
    <Card className="modern-card border-0">
      <div
        className="position-relative"
        style={{ paddingTop: "55%", overflow: "hidden" }}
      >
        <Card.Img
src={project.image_file || project.image_url}
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        />
      </div>
      <Card.Body className="p-4 text-center">
        <h5 className="fw-bold text-theme mb-3">{project.title}</h5>
        <Badge
          bg={project.status === "completed" ? "success" : "primary"}
          className="px-4 py-2 rounded-pill fw-bold text-uppercase d-inline-flex align-items-center gap-2"
          style={{
            boxShadow:
              project.status === "completed"
                ? "0 4px 10px rgba(25, 135, 84, 0.3)"
                : "0 4px 10px rgba(255, 107, 0, 0.3)",
          }}
        >
          {project.status === "completed" ? (
            <FiCheckCircle size={16} />
          ) : (
            <FiCpu size={16} />
          )}
          {project.status === "completed"
            ? t("projects.status_completed")
            : project.status || t("projects.status_unknown")}
        </Badge>
      </Card.Body>
    </Card>
  );
};
