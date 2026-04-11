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
  FiZap,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      const token = response.data.data.token;
      const user = response.data.data.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", user.username);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed", err);
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
            backgroundImage: `linear-gradient(135deg, rgba(8, 9, 10, 0.9) 0%, rgba(255, 107, 0, 0.15) 100%), url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1470')`,
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
                Turn Your Imagination <br />{" "}
                <span className="text-primary">Into Reality</span>
              </h1>
              <p
                className="h5 text-white-50 mb-5"
                style={{ maxWidth: "400px", lineHeight: "1.6" }}
              >
                The fastest and most precise platform to convert designs into
                machine-ready CNC toolpaths.
              </p>

              <div className="d-flex flex-column gap-4 mt-5">
                {[
                  {
                    icon: <FiCpu size={24} />,
                    text: "Ultra-fast G-Code processing",
                  },
                  {
                    icon: <FiLayers size={24} />,
                    text: "Integrated project management",
                  },
                  {
                    icon: <FiPenTool size={24} />,
                    text: "High precision for all CNC machines",
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
                top: "10%",
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-0 bg-transparent w-100"
            style={{ maxWidth: "420px" }}
          >
            <Card.Body className="p-0">
              <div className="d-flex d-lg-none align-items-center gap-2 mb-5 justify-content-center">
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
                <h2 className="fw-black text-theme mb-2">Welcome Back!</h2>
                <p className="text-theme-muted fw-bold">
                  Please enter your details to sign in.
                </p>
              </div>

              <Form onSubmit={handleLogin}>
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
                      placeholder="Enter your username"
                      required
                      className="auth-input py-3 border-0 bg-transparent"
                      style={{ color: "var(--text-main)", boxShadow: "none" }}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-5">
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
                      placeholder="Enter your password"
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
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center text-theme-muted fw-bold">
                  Don't have an account?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate("/register")}
                  >
                    Create a new account
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

export default LoginPage;
