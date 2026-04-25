import React from "react";
import { Card, Form, Row, Col, Image, Badge, Spinner } from "react-bootstrap";
import { FiUser, FiMail } from "react-icons/fi";
import { useTranslation } from "react-i18next"; 
import "./style.css";

export const ProfileOverview = ({ profile }) => {
  const { t } = useTranslation(); 

  if (!profile) {
    return (
      <Card
        className="modern-card border-0 d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <Spinner animation="border" variant="primary" />
      </Card>
    );
  }

  const inputStyle = {
    backgroundColor: "var(--bg-deep)",
    color: "var(--text-main)",
    borderColor: "var(--glass-border)",
  };

  return (
    <Card className="modern-card border-0">
      <Card.Body className="p-4 p-md-5">
        <div className="d-flex align-items-center gap-4 mb-5">
          <Image
            src={`https://ui-avatars.com/api/?name=${profile.username || "U"}&background=FF6B00&color=fff&size=128`}
            roundedCircle
            className="profile-avatar"
          />
          <div>
            <h4 className="fw-bold text-theme mb-1">{profile.username}</h4>
            <Badge
              bg="secondary"
              className="bg-opacity-25 text-theme-muted fw-bold rounded-pill px-3 py-2"
            >
              {t("settings.user_id")}: #{profile.id}
            </Badge>
          </div>
        </div>

        <Form className="d-flex flex-column gap-3">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                  <FiUser className="text-primary" /> {t("settings.username")}
                </Form.Label>
                <Form.Control
                  className="profile-input p-3 rounded-3 fw-bold text-theme-muted"
                  style={inputStyle}
                  value={profile.username}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                  <FiMail className="text-primary" /> {t("settings.email")}
                </Form.Label>
                <Form.Control
                  className="profile-input p-3 rounded-3 fw-bold text-theme-muted"
                  style={inputStyle}
                  value={profile.email || t("settings.no_email")}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};
