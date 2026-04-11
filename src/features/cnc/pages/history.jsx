import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FiDownload,
  FiTrash2,
  FiEye,
  FiClock,
  FiCalendar,
  FiFolder,
  FiPlus,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { projectService } from "../services/projectService";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProjects = async (pageNum, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      setError("");

      const data = await projectService.getMyProjects(pageNum);

      if (append) {
        setProjects((prev) => [...prev, ...data.results]);
      } else {
        setProjects(data.results);
      }

      setHasNext(data.next !== null);
    } catch (err) {
      setError("Failed to load projects from server.");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjects(nextPage, true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this project?",
      )
    ) {
      try {
        await projectService.deleteProject(id);
        setProjects(projects.filter((proj) => proj.id !== id));
      } catch (err) {        // eslint-disable-line no-unused-vars
        alert("Failed to delete project from server.");
      }
    }
  };

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3 fade-in-up">
        <div>
          <h1 className="display-5 fw-black text-theme mb-2">
            My <span className="text-primary">Projects</span>
          </h1>
          <p className="text-theme-muted mb-0">
            Access and manage your CNC setup and generated G-Code files.
          </p>
        </div>
        <Button
          onClick={() => navigate("/new-project")}
          className="btn-primary-custom d-flex align-items-center justify-content-center gap-2"
        >
          <FiPlus size={20} /> New Project
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="rounded-4 fw-bold">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center py-5 my-5">
          <Spinner animation="grow" style={{ color: "#FF6B00" }} />
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
            <FiFolder size={60} className="text-theme-muted mb-3 opacity-50" />
            <h4 className="text-theme fw-bold">No Projects Found</h4>
            <p className="text-theme-muted mb-4">
              You haven't created any CNC projects yet. Start by turning an
              image into a toolpath!
            </p>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/new-project")}
              className="rounded-pill px-4 py-2 fw-bold"
              style={{
                borderColor: "var(--primary-orange)",
                color: "var(--primary-orange)",
              }}
            >
              Create Your First Project
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="g-4">
            <AnimatePresence>
              {projects.map((project) => (
                <Col xs={12} sm={6} lg={4} key={project.id}>
                  <motion.div
                    variants={fadeUpVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="h-100"
                  >
                    <Card className="modern-card h-100 border-0 d-flex flex-column">
                      <div
                        className="position-relative"
                        style={{ paddingTop: "55%", overflow: "hidden" }}
                      >
                        <Card.Img
                          src={project.image_url}
                          alt={project.title}
                          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                        />
                        <Badge
                          bg={
                            project.status === "completed"
                              ? "success"
                              : "warning"
                          }
                          className="position-absolute top-0 end-0 m-3 px-3 py-2 fw-bold rounded-pill shadow-sm text-uppercase"
                          style={{ letterSpacing: "1px", fontSize: "10px" }}
                        >
                          {project.status || "UNKNOWN"}
                        </Badge>
                      </div>

                      <Card.Body className="p-4 d-flex flex-column">
                        <Card.Title className="h5 fw-bold text-theme mb-3 text-truncate">
                          {project.title}
                        </Card.Title>

                        <div className="d-flex flex-column gap-2 mb-4">
                          <div className="text-theme-muted small fw-bold d-flex align-items-center gap-2">
                            <FiCalendar size={16} className="text-primary" />
                            {new Date(
                              project.created_at || Date.now(),
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-theme-muted small fw-bold d-flex align-items-center gap-2">
                            <FiClock size={16} className="text-primary" />
                            Dim: {project.dimension_x} x {project.dimension_y} x{" "}
                            {project.dimension_z} mm
                          </div>
                        </div>

                        <div
                          className="d-flex gap-2 mt-auto pt-3 border-top"
                          style={{ borderColor: "var(--glass-border)" }}
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View Details</Tooltip>}
                          >
                            <Button
                              variant="light"
                              onClick={() => navigate(`/project/${project.id}`)}
                              className="d-flex align-items-center justify-content-center p-2 rounded-3"
                              style={{
                                backgroundColor: "var(--bg-deep)",
                                color: "var(--text-main)",
                                border: "1px solid var(--glass-border)",
                              }}
                            >
                              <FiEye size={20} />
                            </Button>
                          </OverlayTrigger>

                          <Button
                            disabled={!project.gcode_file_url}
                            href={project.gcode_file_url}
                            target="_blank"
                            download
                            className="flex-grow-1 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                            style={{
                              background: project.gcode_file_url
                                ? "linear-gradient(135deg, #F47521 0%, #FF914D 100%)"
                                : "var(--bg-deep)",
                              border: "none",
                              color: project.gcode_file_url
                                ? "white"
                                : "var(--text-muted-custom)",
                              boxShadow: project.gcode_file_url
                                ? "0 5px 15px rgba(244, 117, 33, 0.3)"
                                : "none",
                            }}
                          >
                            <FiDownload size={18} />
                            {project.gcode_file_url ? "Get .nc" : "Pending"}
                          </Button>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Delete Project</Tooltip>}
                          >
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(project.id)}
                              className="d-flex align-items-center justify-content-center p-2 rounded-3"
                              style={{
                                backgroundColor: "rgba(255, 0, 0, 0.1)",
                                color: "#ff4d4d",
                                border: "none",
                              }}
                            >
                              <FiTrash2 size={20} />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
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
                variant="outline-primary"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-5 py-2 rounded-pill fw-bold"
                style={{
                  borderColor: "rgba(255, 107, 0, 0.4)",
                  color: "var(--primary-orange)",
                }}
              >
                {loadingMore ? "Loading..." : "Load More Projects"}
              </Button>
            </motion.div>
          )}
        </>
      )}
    </Container>
  );
};

export default HistoryPage;
