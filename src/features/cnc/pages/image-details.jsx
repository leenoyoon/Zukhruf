import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiPlay,
  FiTrash2,
  FiCalendar,
  FiAlignLeft,
  FiSettings,
} from "react-icons/fi";
import { imageService } from "../services/imageService";

const ImageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await imageService.getImageDetails(id);
        setImageDetails(data.data || data);
      } catch (err) {
        console.error("Failed to load details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await imageService.deleteImage(id);

        navigate("/gallery");
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };
  const slideRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

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

  if (!imageDetails)
    return (
      <Container className="py-5 mt-5 text-center">
        <Button
          variant="link"
          onClick={() => navigate("/gallery")}
          className="text-theme text-decoration-none fw-bold"
        >
          <FiArrowLeft className="me-2" /> Back to Gallery
        </Button>
      </Container>
    );

  return (
    <Container className="py-5 mt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4"
      >
        <Button
          variant="link"
          onClick={() => navigate("/gallery")}
          className="text-theme-muted text-decoration-none p-0 d-flex align-items-center gap-2 fw-bold"
          style={{ transition: "color 0.3s" }}
          onMouseEnter={(e) => (e.target.style.color = "#FF6B00")}
          onMouseLeave={(e) =>
            (e.target.style.color = "var(--text-muted-custom)")
          }
        >
          <FiArrowLeft size={20} /> Back to Gallery
        </Button>
      </motion.div>

      <Row className="g-4 align-items-start">
        <Col
          xs={12}
          lg={7}
          as={motion.div}
          variants={slideLeft}
          initial="hidden"
          animate="visible"
        >
          <Card
            className="modern-card border-0 p-3 h-100 d-flex align-items-center justify-content-center"
            style={{ minHeight: "500px" }}
          >
            <img
              src={imageDetails.image_url}
              alt={imageDetails.title}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: "15px",
              }}
            />
          </Card>
        </Col>
        <Col
          xs={12}
          lg={5}
          as={motion.div}
          variants={slideRight}
          initial="hidden"
          animate="visible"
        >
          <div className="d-flex flex-column gap-4">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h2 className="fw-black text-theme display-6 mb-0">
                  {imageDetails.title}
                </h2>
                {imageDetails.is_pattern && (
                  <Badge
                    bg="primary"
                    className="px-3 py-2 rounded-pill fw-bold"
                    style={{ boxShadow: "0 4px 10px rgba(255, 107, 0, 0.3)" }}
                  >
                    Pattern
                  </Badge>
                )}
              </div>

              <div className="text-theme-muted d-flex align-items-center gap-2 mt-3 fw-bold small">
                <FiCalendar size={16} />
                Uploaded on:{" "}
                {new Date(
                  imageDetails.created_at || Date.now(),
                ).toLocaleDateString()}
              </div>
            </div>
            <Card
              className="border-0 rounded-4"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <Card.Body className="p-4">
                <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                  <FiAlignLeft size={18} /> Description
                </h6>
                <p
                  className="text-theme mb-0"
                  style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}
                >
                  {imageDetails.description ||
                    "No description provided for this image. You can proceed to generate CNC toolpaths directly."}
                </p>
              </Card.Body>
            </Card>
            <Card
              className="border-0 rounded-4"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <Card.Body className="p-4">
                <h6 className="fw-bold text-primary mb-4 d-flex align-items-center gap-2">
                  <FiSettings size={18} /> Actions
                </h6>

                <div className="d-flex flex-column gap-3">
                  <Button
                    onClick={() =>
                      navigate("/new-project", {
                        state: {
                          selectedImageId: imageDetails.id,
                          selectedImageUrl: imageDetails.image_url,
                        },
                      })
                    }
                    className="btn-primary-custom py-3 d-flex justify-content-center align-items-center gap-2 fs-5"
                  >
                    <FiPlay size={22} /> Generate G-Code
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={handleDelete}
                    className="py-3 rounded-3 fw-bold d-flex justify-content-center align-items-center gap-2"
                    style={{ borderWidth: "2px" }}
                  >
                    <FiTrash2 size={20} /> Delete Image
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ImageDetailsPage;
