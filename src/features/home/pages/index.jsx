import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Stack,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import {
  FiCalendar,
  FiUploadCloud,
  FiCpu,
  FiDownload,
  FiPlay,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { imageService } from "../../cnc/services/imageService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const data = await imageService.getAllPatterns(1);
        setPatterns(data.results.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatterns();
  }, []);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="pb-5" style={{ overflowX: "hidden" }}>
      <div className="bg-mesh" />

      <section
        className="position-relative d-flex align-items-center justify-content-center"
        style={{ paddingTop: "160px", paddingBottom: "120px" }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 z-n1 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "10%",
              right: "15%",
              width: "35vw",
              height: "35vw",
              background:
                "radial-gradient(circle, rgba(255, 107, 0, 0.12) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            style={{
              position: "absolute",
              bottom: "-10%",
              left: "10%",
              width: "40vw",
              height: "40vw",
              background:
                "radial-gradient(circle, rgba(255, 138, 0, 0.08) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <Container className="position-relative z-1 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="d-flex flex-column align-items-center"
          >
            <div
              className="mb-4 px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2"
              style={{
                fontSize: "0.9rem",
                boxShadow: "0 0 20px rgba(255, 107, 0, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid #FF6B00",
                color: "#FF6B00",
              }}
            >
              <HiSparkles size={18} /> Smart CNC Toolpath Generator
            </div>

            <h1
              className="fw-black mb-4 text-theme"
              style={{
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                letterSpacing: "-2px",
                lineHeight: "1.2",
              }}
            >
              The Art of Precision in <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #FF6B00 0%, #FFB067 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 30px rgba(255,107,0,0.3))",
                }}
              >
                Smart Manufacturing
              </span>
            </h1>

            <p
              className="text-theme-muted mb-5 mx-auto h5"
              style={{ maxWidth: "680px", lineHeight: "1.8" }}
            >
              Turn your engineering imagination into tangible mechanical
              reality. Fignna provides the most precise and fast processing
              tools to generate G-Code toolpaths with a single click.
            </p>

            <Stack
              direction="horizontal"
              gap={3}
              className="justify-content-center flex-wrap"
            >
              <Button
                onClick={() => navigate("/new-project")}
                className="btn-primary-custom px-5 py-3 h5 mb-0 d-flex align-items-center gap-2 rounded-pill"
                style={{ boxShadow: "0 10px 30px rgba(255, 107, 0, 0.35)" }}
              >
                <FiPlay fill="currentColor" /> Start Processing
              </Button>

              <Button
                onClick={() => navigate("/gallery")}
                className="px-5 py-3 rounded-pill fw-bold h5 mb-0 bg-transparent"
                style={{
                  border: "2px solid #FF6B00",
                  color: "#FF6B00",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FF6B00";
                  e.target.style.color = "#fff";
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 10px 30px rgba(255, 107, 0, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#FF6B00";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Explore Gallery
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </section>

      <Container
        style={{ marginTop: "-50px", position: "relative", zIndex: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            className="modern-card border-0 py-4 shadow-lg"
            style={{
              backgroundColor: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
            }}
          >
            <Row className="text-center g-4">
              <Col
                md={4}
                className="border-end border-secondary border-opacity-25"
              >
                <h2
                  className="fw-black text-theme mb-0"
                  style={{ color: "#FF6B00" }}
                >
                  +5,000
                </h2>
                <p className="text-theme-muted fw-bold mb-0">Ready Patterns</p>
              </Col>
              <Col
                md={4}
                className="border-end border-secondary border-opacity-25"
              >
                <h2 className="fw-black text-theme mb-0">+12,000</h2>
                <p className="text-theme-muted fw-bold mb-0">
                  Converted Projects
                </p>
              </Col>
              <Col md={4}>
                <h2 className="fw-black text-theme mb-0">99.9%</h2>
                <p className="text-theme-muted fw-bold mb-0">G-Code Accuracy</p>
              </Col>
            </Row>
          </Card>
        </motion.div>
      </Container>

      <Container className="mt-5 pt-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="text-center mb-5"
        >
          <h2 className="fw-black h1 text-theme mb-3">
            How it <span style={{ color: "#FF6B00" }}>Works?</span>
          </h2>
          <p className="text-theme-muted mx-auto" style={{ maxWidth: "600px" }}>
            Three simple steps between your image and a machine-ready toolpath.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Row className="g-4 text-center">
            {[
              {
                icon: <FiUploadCloud size={40} />,
                title: "1. Upload Design",
                desc: "Upload your image or logo (PNG/JPG) using our drag-and-drop interface.",
              },
              {
                icon: <FiCpu size={40} />,
                title: "2. Set Dimensions",
                desc: "Set workpiece dimensions (X, Y) and safe depth (Z) for toolpath processing.",
              },
              {
                icon: <FiDownload size={40} />,
                title: "3. Download G-Code",
                desc: "Get a fully compatible (.nc) file for all CNC machines with one click.",
              },
            ].map((step, idx) => (
              <Col lg={4} key={idx}>
                <motion.div variants={fadeUpVariant} className="h-100">
                  <Card className="modern-card h-100 border-0 p-4">
                    <Card.Body>
                      <div className="mb-4" style={{ color: "#FF6B00" }}>
                        {step.icon}
                      </div>
                      <h4 className="fw-bold text-theme mb-3">{step.title}</h4>
                      <p className="text-theme-muted mb-0">{step.desc}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>

      <Container className="mt-5 pt-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariant}
          className="d-flex justify-content-between align-items-end mb-5"
        >
          <div>
            <h2 className="fw-black h1 mb-1 text-theme">
              Public <span style={{ color: "#FF6B00" }}>Patterns</span>
            </h2>
            <p className="text-theme-muted mb-0">
              Professional and consistent designs from the community.
            </p>
          </div>
          <Button
            onClick={() => navigate("/gallery")}
            variant="link"
            className="fw-bold text-decoration-none h5 mb-0 d-flex align-items-center gap-2"
            style={{ transition: "0.3s", color: "#FF6B00" }}
            onMouseEnter={(e) => (e.target.style.transform = "translateX(5px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateX(0)")}
          >
            View All <FaArrowRight />
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
                    <div
                      style={{
                        position: "relative",
                        paddingTop: "60%",
                        overflow: "hidden",
                      }}
                    >
                      <Card.Img
                        src={item.image_url}
                        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                      />

                      {item.is_pattern && (
                        <span
                          className="position-absolute top-0 end-0 m-3 px-3 py-1 fw-bold rounded-pill"
                          style={{
                            backgroundColor: "#FF6B00",
                            color: "#ffffff",
                            boxShadow: "0 4px 10px rgba(255, 107, 0, 0.4)",
                            fontSize: "0.75rem",
                            zIndex: 10,
                          }}
                        >
                          PATTERN
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
                          {item.description || "No description"}
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
                            @{item.uploaded_by_username || "User"}
                          </span>
                        </Stack>
                        <div
                          className="text-theme-muted small d-flex align-items-center gap-1 fw-bold"
                          style={{ fontSize: "0.75rem" }}
                        >
                          <FiCalendar />
                          {new Date(item.created_at).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short", year: "numeric" },
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

      <Container className="mt-5 pt-5 mb-3">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
        >
          <Card
            className="modern-card border-0 p-5 text-center position-relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 107, 0, 0.05) 0%, rgba(20, 22, 26, 0.2) 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: "-10%",
                width: "300px",
                height: "300px",
                background:
                  "radial-gradient(circle, rgba(255, 107, 0, 0.1) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <Card.Body className="py-5 position-relative z-1">
              <h2 className="fw-black text-theme mb-3 display-5">
                Ready to turn your ideas into reality?
              </h2>
              <p
                className="text-theme-muted mb-5 h5"
                style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                }}
              >
                Join hundreds of engineers and designers who trust Fignna for
                precise CNC toolpaths.
              </p>
              <Button
                onClick={() => navigate("/new-project")}
                className="btn-primary-custom px-5 py-3 h4 mb-0 fw-bold rounded-pill"
                style={{ boxShadow: "0 10px 30px rgba(255, 107, 0, 0.3)" }}
              >
                Start Your First Project Free
              </Button>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default DashboardPage;
