import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Image,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { FiLock, FiUser, FiMail, FiShield } from "react-icons/fi";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { authService } from "../../auth/services/authService";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [profile, setProfile] = useState({ username: "", id: "", email: "" });
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authService.getProfile();
        const userData = data.data || data;
        setProfile({
          username: userData.username,
          id: userData.id,
          email: userData.email || "No email linked",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(passwords.old, passwords.new);
      toast.success("Password updated successfully!");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const inputStyle = {
    backgroundColor: "var(--bg-deep)",
    color: "var(--text-main)",
    borderColor: "var(--glass-border)",
  };

  if (fetching)
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

  return (
    <Container className="py-5 mt-4" style={{ maxWidth: "800px" }}>
      <style>{`
        .custom-input:focus { background-color: var(--bg-deep); color: var(--text-main); border-color: var(--primary-orange); box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.25); }
        .custom-input:disabled { opacity: 0.6; background-color: var(--bg-surface); cursor: not-allowed; }
      `}</style>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="mb-5"
      >
        <h1 className="display-5 fw-black text-theme mb-2">
          Account <span className="text-primary">Settings</span>
        </h1>
        <p className="text-theme-muted">
          Manage your profile and security preferences.
        </p>
      </motion.div>

      <div className="d-flex flex-column gap-4">
        <motion.div initial="hidden" animate="visible" variants={fadeUpVariant}>
          <Card className="modern-card border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center gap-4 mb-5">
                <Image
                  src={`https://ui-avatars.com/api/?name=${profile.username || "U"}&background=FF6B00&color=fff&size=128`}
                  roundedCircle
                  style={{
                    width: "80px",
                    height: "80px",
                    boxShadow: "0 8px 20px rgba(255, 107, 0, 0.3)",
                  }}
                />
                <div>
                  <h4 className="fw-bold text-theme mb-1">
                    {profile.username}
                  </h4>
                  <Badge
                    bg="secondary"
                    className="bg-opacity-25 text-theme-muted fw-bold rounded-pill px-3 py-2"
                  >
                    User ID: #{profile.id}
                  </Badge>
                </div>
              </div>

              <Form className="d-flex flex-column gap-3">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                        <FiUser className="text-primary" /> Username
                      </Form.Label>
                      <Form.Control
                        className="custom-input p-3 rounded-3 fw-bold text-theme-muted"
                        style={inputStyle}
                        value={profile.username}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                        <FiMail className="text-primary" /> Email
                      </Form.Label>
                      <Form.Control
                        className="custom-input p-3 rounded-3 fw-bold text-theme-muted"
                        style={inputStyle}
                        value={profile.email}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUpVariant}>
          <Card className="modern-card border-0">
            <Card.Body className="p-4 p-md-5">
              <h5 className="fw-bold text-theme mb-4 d-flex align-items-center gap-2">
                <FiShield className="text-primary" size={24} /> Security
              </h5>

              <Form
                onSubmit={handlePasswordChange}
                className="d-flex flex-column gap-3"
              >
                <Form.Group>
                  <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                    <FiLock /> Old Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    className="custom-input p-3 rounded-3"
                    style={inputStyle}
                    required
                    value={passwords.old}
                    onChange={(e) =>
                      setPasswords({ ...passwords, old: e.target.value })
                    }
                  />
                </Form.Group>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                        <FiLock /> New Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        className="custom-input p-3 rounded-3"
                        style={inputStyle}
                        required
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({ ...passwords, new: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                        <FiLock /> Confirm New Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        className="custom-input p-3 rounded-3"
                        style={inputStyle}
                        required
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirm: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-custom w-100 py-3 mt-3 fw-bold fs-6"
                >
                  {loading ? <Spinner size="sm" className="me-2" /> : null}
                  {loading ? "PROCESSING..." : "SAVE CHANGES"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </motion.div>
      </div>
    </Container>
  );
};

export default SettingsPage;
