import React, { useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ProgressBar,
} from "react-bootstrap";
import {
  FiUploadCloud,
  FiSettings,
  FiMaximize,
  FiTrash2,
  FiCpu,
  FiCheckCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/axios";

const ProcessPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [imageDetails, setImageDetails] = useState({
    title: "",
    description: "Uploaded via Zukhruf React App",
    is_pattern: false,
  });

  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [dimensions, setDimensions] = useState({ x: 100, y: 100, z: 10 });
  const [createdProjectId, setCreatedProjectId] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(
        Object.assign(uploadedFile, {
          preview: URL.createObjectURL(uploadedFile),
        }),
      );
      setImageDetails((prev) => ({
        ...prev,
        title: uploadedFile.name.split(".")[0],
      }));
      setUploadedImageId(null);
      setCreatedProjectId(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".svg"] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("title", imageDetails.title);
      formData.append("description", imageDetails.description);
      formData.append("image_file", file);
      formData.append("is_pattern", imageDetails.is_pattern ? "1" : "0");

      const response = await api.post("images/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      const responseData = response.data.data || response.data;
      setUploadedImageId(responseData.id);
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  const handleCreateProject = async () => {
    if (!uploadedImageId) return;

    setIsCreatingProject(true);

    try {
      const formData = new FormData();
      formData.append("title", imageDetails.title + " - CNC Project");
      formData.append("image", uploadedImageId);
      formData.append("dimension_x", dimensions.x);
      formData.append("dimension_y", dimensions.y);
      formData.append("dimension_z", dimensions.z);

      const response = await api.post("projects/", formData);
      const projectData = response.data.data || response.data;

      setCreatedProjectId(projectData.id);

      setTimeout(() => navigate("/history"), 2000);
    } catch (error) {
      console.error("Project Creation Error:", error);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const inputStyle = {
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-main)",
    borderColor: "var(--glass-border)",
  };

  return (
    <Container className="py-5 mt-4">
      <style>{`
        .custom-input:focus { background-color: var(--bg-surface); color: var(--text-main); border-color: var(--primary-orange); box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.25); }
        .custom-input:disabled { opacity: 0.6; background-color: var(--bg-deep); }
        .custom-switch .form-check-input:checked { background-color: var(--primary-orange); border-color: var(--primary-orange); }
      `}</style>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="display-5 fw-black text-theme mb-4">
          Start <span className="text-primary">New Project</span>
        </h1>
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
          <div className="d-flex flex-column gap-4">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  {...getRootProps()}
                  className={`p-5 rounded-4 text-center cursor-pointer transition-all ${isDragActive ? "border-primary" : "border-secondary"}`}
                  style={{
                    backgroundColor: isDragActive
                      ? "rgba(255, 107, 0, 0.08)"
                      : "var(--glass-bg)",
                    border: `2px dashed ${isDragActive ? "var(--primary-orange)" : "var(--glass-border)"}`,
                  }}
                >
                  <input {...getInputProps()} />
                  <FiUploadCloud
                    size={60}
                    className={`mb-3 ${isDragActive ? "text-primary" : "text-theme-muted opacity-50"}`}
                  />
                  <h5 className="fw-bold text-theme">Drag & Drop Image</h5>
                  <p className="text-theme-muted small mb-0 mt-2">
                    or{" "}
                    <span className="text-primary fw-bold">Browse Files</span>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="file-info"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3 rounded-4 d-flex align-items-center gap-3"
                  style={{
                    backgroundColor: "rgba(255, 107, 0, 0.05)",
                    border: "1px solid rgba(255, 107, 0, 0.3)",
                  }}
                >
                  <img
                    src={file.preview}
                    alt="preview"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "12px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <h6 className="fw-bold text-theme mb-0 text-truncate">
                      {file.name}
                    </h6>
                    <small className="text-theme-muted">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>
                  <Button
                    variant="link"
                    className="p-0 text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setUploadedImageId(null);
                    }}
                    disabled={isUploading || createdProjectId}
                  >
                    <FiTrash2 size={22} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="modern-card border-0">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <FiSettings size={22} className="text-primary" />
                  <h5 className="fw-bold text-theme mb-0">
                    Step 1: Image Details
                  </h5>
                </div>

                <Form className="d-flex flex-column gap-3">
                  <Form.Group>
                    <Form.Label className="text-theme fw-bold small">
                      Image Title
                    </Form.Label>
                    <Form.Control
                      className="custom-input p-2 rounded-3"
                      style={inputStyle}
                      value={imageDetails.title}
                      onChange={(e) =>
                        setImageDetails({
                          ...imageDetails,
                          title: e.target.value,
                        })
                      }
                      disabled={isUploading || uploadedImageId}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="text-theme fw-bold small">
                      Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      className="custom-input p-2 rounded-3"
                      style={inputStyle}
                      value={imageDetails.description}
                      onChange={(e) =>
                        setImageDetails({
                          ...imageDetails,
                          description: e.target.value,
                        })
                      }
                      disabled={isUploading || uploadedImageId}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2 custom-switch">
                    <Form.Check
                      type="switch"
                      id="pattern-switch"
                      label={
                        <span className="text-theme fw-bold">
                          Save as Public Pattern
                        </span>
                      }
                      checked={imageDetails.is_pattern}
                      onChange={(e) =>
                        setImageDetails({
                          ...imageDetails,
                          is_pattern: e.target.checked,
                        })
                      }
                      disabled={isUploading || uploadedImageId}
                    />
                  </Form.Group>

                  {!uploadedImageId && (
                    <Button
                      disabled={!file || isUploading || uploadedImageId}
                      onClick={handleUpload}
                      className="btn-primary-custom w-100 py-3 mt-2 fw-bold"
                    >
                      {isUploading
                        ? `UPLOADING... ${uploadProgress}%`
                        : "UPLOAD TO SERVER"}
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>

            <Card
              className="modern-card border-0 transition-all"
              style={{
                opacity: uploadedImageId ? 1 : 0.4,
                pointerEvents: uploadedImageId ? "auto" : "none",
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <FiCpu size={22} className="text-success" />
                  <h5 className="fw-bold text-theme mb-0">Step 2: CNC Setup</h5>
                </div>

                <Form className="d-flex flex-column gap-3">
                  <Row className="g-2">
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="text-theme fw-bold small">
                          Width (X)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          className="custom-input"
                          style={inputStyle}
                          value={dimensions.x}
                          onChange={(e) =>
                            setDimensions({ ...dimensions, x: e.target.value })
                          }
                          disabled={createdProjectId}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="text-theme fw-bold small">
                          Height (Y)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          className="custom-input"
                          style={inputStyle}
                          value={dimensions.y}
                          onChange={(e) =>
                            setDimensions({ ...dimensions, y: e.target.value })
                          }
                          disabled={createdProjectId}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group>
                    <Form.Label className="text-theme fw-bold small">
                      Safe Height (Z)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      className="custom-input"
                      style={inputStyle}
                      value={dimensions.z}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, z: e.target.value })
                      }
                      disabled={createdProjectId}
                    />
                  </Form.Group>

                  <Button
                    disabled={
                      isCreatingProject || createdProjectId || !uploadedImageId
                    }
                    onClick={handleCreateProject}
                    className="w-100 py-3 mt-2 fw-bold d-flex justify-content-center align-items-center gap-2"
                    style={{
                      background: createdProjectId
                        ? "#198754"
                        : "linear-gradient(135deg, #20c997 0%, #198754 100%)",
                      border: "none",
                      color: "white",
                      boxShadow: createdProjectId
                        ? "none"
                        : "0 8px 20px rgba(25, 135, 84, 0.3)",
                    }}
                  >
                    {isCreatingProject ? (
                      "CREATING..."
                    ) : createdProjectId ? (
                      <>
                        <FiCheckCircle size={20} /> PROJECT CREATED
                      </>
                    ) : (
                      "CREATE PROJECT"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Col>

        <Col
          xs={12}
          lg={8}
          as={motion.div}
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
        >
          <Card
            className="modern-card border-0 h-100 d-flex flex-column"
            style={{ minHeight: "600px" }}
          >
            <Card.Header className="bg-transparent border-bottom border-secondary border-opacity-10 py-3 d-flex justify-content-between align-items-center">
              <span className="text-theme-muted fw-black text-uppercase tracking-wider small">
                Image Preview
              </span>
              <FiMaximize className="text-theme-muted opacity-50" />
            </Card.Header>

            <Card.Body
              className="position-relative d-flex align-items-center justify-content-center flex-grow-1 p-4"
              style={{ backgroundColor: "var(--bg-deep)" }}
            >
              <div
                className="position-absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "radial-gradient(var(--text-main) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />

              {file ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: isUploading ? 0.3 : 1, scale: 1 }}
                  src={file.preview}
                  className="img-fluid rounded-4 position-relative z-1"
                  style={{
                    maxHeight: "500px",
                    filter: isUploading ? "blur(4px)" : "none",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  }}
                />
              ) : (
                <div className="text-theme-muted fw-bold position-relative z-1 opacity-50">
                  No Image Selected
                </div>
              )}

              {isUploading && (
                <div className="position-absolute z-2 w-50 text-center">
                  <h6
                    className="text-primary fw-black mb-3"
                    style={{ letterSpacing: "2px" }}
                  >
                    SENDING TO SERVER...
                  </h6>
                  <ProgressBar
                    animated
                    now={uploadProgress}
                    variant="warning"
                    style={{
                      height: "10px",
                      backgroundColor: "var(--glass-bg)",
                    }}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProcessPage;
