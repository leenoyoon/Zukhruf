import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import {
  FiUser,
  FiLock,
  FiCpu,
  FiLayers,
  FiPenTool,
  FiMail,
  FiZap,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../lib/axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("auth/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.status === 1 || response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed", err);
    } finally {
      setLoading(false);
    }
  };

  const iconStyle = {
    backgroundColor: "var(--bg-surface)",
    color: "var(--primary-orange)",
    borderColor: "var(--glass-border)",
    borderRight: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-deep)",
        overflowX: "hidden",
      }}
    >
      <style>{`
        .auth-input:focus { background-color: var(--bg-deep) !important; color: var(--text-main) !important; border-color: var(--primary-orange) !important; box-shadow: none !important; }
      `}</style>

      <Row className="m-0 min-vh-100">
        <Col
          lg={6}
          className="d-none d-lg-flex flex-column justify-content-between position-relative p-5"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(8, 9, 10, 0.9) 0%, rgba(255, 107, 0, 0.15) 100%), url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1470')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRight: "1px solid var(--glass-border)",
          }}
        >
          <div className="position-relative z-1">
            <div className="d-inline-flex align-items-center gap-2 mb-5">
              <div
                className="p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #FF6B00 0%, #FFB067 100%)",
                }}
              >
                <FiZap size={24} color="white" />
              </div>
              <h2 className="mb-0 fw-black text-white">Zukhruf</h2>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1
                className="display-4 fw-black text-white mb-4"
                style={{ lineHeight: "1.2" }}
              >
                Start Your Journey <br />{" "}
                <span className="text-primary">Into Smart Mfg</span>
              </h1>
              <p
                className="h5 text-white-50 mb-5"
                style={{ maxWidth: "400px", lineHeight: "1.6" }}
              >
                Join hundreds of engineers and designers trusting our platform
                for high-precision CNC toolpaths.
              </p>

              <div className="d-flex flex-column gap-4 mt-5">
                {[
                  {
                    icon: <FiCpu size={24} />,
                    text: "Instant G-Code generation",
                  },
                  {
                    icon: <FiLayers size={24} />,
                    text: "Public pattern library",
                  },
                  {
                    icon: <FiPenTool size={24} />,
                    text: "Advanced & easy control interface",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center gap-3 text-white-50 fw-bold"
                  >
                    <div
                      className="p-3 rounded-circle"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        color: "var(--primary-orange)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="position-relative z-1 text-white-50 small fw-bold">
            © 2026 Zukhruf CNC Hub. All rights reserved.
          </div>
        </Col>

        <Col
          xs={12}
          lg={6}
          className="d-flex align-items-center justify-content-center p-4 position-relative"
        >
          <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 z-n1 pointer-events-none">
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                right: "10%",
                width: "300px",
                height: "300px",
                background:
                  "radial-gradient(circle, rgba(255, 107, 0, 0.05) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
          </div>

          <Card
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-0 bg-transparent w-100 position-relative"
            style={{ maxWidth: "420px" }}
          >
            <Card.Body className="p-0 mt-4">
              <div className="d-flex d-lg-none align-items-center gap-2 mb-5 justify-content-center mt-3">
                <div
                  className="p-2 rounded-circle shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF6B00 0%, #FFB067 100%)",
                  }}
                >
                  <FiZap size={20} color="white" />
                </div>
                <h3 className="mb-0 fw-black text-theme">Zukhruf</h3>
              </div>

              <div className="mb-5 text-center text-lg-start">
                <h2 className="fw-black text-theme mb-2">Create Account</h2>
                <p className="text-theme-muted fw-bold">
                  Sign up now to start creating your CNC projects.
                </p>
              </div>

              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-theme fw-bold small">
                    Username
                  </Form.Label>
                  <InputGroup
                    className="rounded-3 overflow-hidden"
                    style={{ border: "1px solid var(--glass-border)" }}
                  >
                    <InputGroup.Text
                      style={iconStyle}
                      className="px-3 bg-transparent"
                    >
                      <FiUser size={18} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required
                      className="auth-input py-3 border-0 bg-transparent"
                      style={{ color: "var(--text-main)", boxShadow: "none" }}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-theme fw-bold small">
                    Email Address{" "}
                    <span className="opacity-50 fw-normal">(Optional)</span>
                  </Form.Label>
                  <InputGroup
                    className="rounded-3 overflow-hidden"
                    style={{ border: "1px solid var(--glass-border)" }}
                  >
                    <InputGroup.Text
                      style={iconStyle}
                      className="px-3 bg-transparent"
                    >
                      <FiMail size={18} />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="auth-input py-3 border-0 bg-transparent"
                      style={{ color: "var(--text-main)", boxShadow: "none" }}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-theme fw-bold small">
                    Password
                  </Form.Label>
                  <InputGroup
                    className="rounded-3 overflow-hidden"
                    style={{ border: "1px solid var(--glass-border)" }}
                  >
                    <InputGroup.Text
                      style={iconStyle}
                      className="px-3 bg-transparent"
                    >
                      <FiLock size={18} />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      className="auth-input py-3 border-0 bg-transparent"
                      style={{ color: "var(--text-main)", boxShadow: "none" }}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-5">
                  <Form.Label className="text-theme fw-bold small">
                    Confirm Password
                  </Form.Label>
                  <InputGroup
                    className="rounded-3 overflow-hidden"
                    style={{ border: "1px solid var(--glass-border)" }}
                  >
                    <InputGroup.Text
                      style={iconStyle}
                      className="px-3 bg-transparent"
                    >
                      <FiLock size={18} />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      required
                      className="auth-input py-3 border-0 bg-transparent"
                      style={{ color: "var(--text-main)", boxShadow: "none" }}
                    />
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-custom w-100 py-3 mb-4 fw-bold fs-6 rounded-pill d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? <Spinner size="sm" /> : null}
                  {loading ? "Creating account..." : "Register Now"}
                </Button>

                <div className="text-center text-theme-muted fw-bold">
                  Already have an account?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate("/login")}
                  >
                    Login here
                  </span>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
