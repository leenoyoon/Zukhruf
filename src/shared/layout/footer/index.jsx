import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FiGithub,
  FiMail,
  FiChevronRight,
  FiChevronLeft,
  FiZap,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";

const Footer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const siteLinks = [
    { label: t("footer.link_home", "Home Page"), path: "/home" },
    { label: t("footer.link_gallery", "Explore Gallery"), path: "/gallery" },
    {
      label: t("footer.link_new_project", "Create New Project"),
      path: "/new-project",
    },
    { label: t("footer.link_projects", "My Projects"), path: "/projects" },
  ];

  const ChevronIcon = i18n.language === "ar" ? FiChevronLeft : FiChevronRight;

  return (
    <footer
      className="mt-auto position-relative overflow-hidden"
      style={{
        borderTop: "1px solid var(--glass-border)",
        backgroundColor: "var(--bg-deep)",
        paddingTop: "80px",
        paddingBottom: "30px",
      }}
    >
      <Container className="position-relative z-1">
        <Row className="gy-5 justify-content-between mb-5">
          <Col xs={12} md={5} lg={4}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <div
                className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background:
                    "linear-gradient(135deg, #FF6B00 0%, #FFB067 100%)",
                }}
              >
                <FiZap size={20} color="white" />
              </div>
              <h3 className="mb-0 fw-black text-theme">
                {t("nav.brand_name")}
              </h3>
            </div>
            <p
              className="text-theme-muted fw-bold mb-4"
              style={{ lineHeight: "1.8", fontSize: "0.95rem" }}
            >
              {t(
                "footer.desc",
                "The ultimate engineering platform for image processing and G-Code generation. Built for precision and creators.",
              )}
            </p>
          </Col>

          <Col xs={12} md={3} lg={3}>
            <h5 className="fw-black text-theme mb-4 position-relative d-inline-block">
              {t("footer.quick_links", "Quick Links")}
              <div
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: i18n.language === "ar" ? "auto" : 0,
                  right: i18n.language === "ar" ? 0 : "auto",
                  width: "40%",
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: "var(--primary-orange)",
                }}
              />
            </h5>
            <div className="d-flex flex-column gap-3 mt-3">
              {siteLinks.map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(link.path)}
                  className="footer-link"
                >
                  <ChevronIcon size={18} /> {link.label}
                </div>
              ))}
            </div>
          </Col>

          <Col xs={12} md={4} lg={3}>
            <h5 className="fw-black text-theme mb-4 position-relative d-inline-block">
              {t("footer.connect", "Connect With Us")}
              <div
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: i18n.language === "ar" ? "auto" : 0,
                  right: i18n.language === "ar" ? 0 : "auto",
                  width: "40%",
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: "var(--primary-orange)",
                }}
              />
            </h5>
            <p className="text-theme-muted fw-bold small mb-4 mt-3">
              {t(
                "footer.connect_desc",
                "Have questions or feedback? Feel free to reach out.",
              )}
            </p>
            <div className="d-flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <FiGithub size={22} />
              </a>
              <a href="mailto:support@zukhruf.com" className="social-btn">
                <FiMail size={22} />
              </a>
            </div>
          </Col>
        </Row>

        <div
          className="pt-4 mt-4 d-flex justify-content-center align-items-center"
          style={{ borderTop: "1px solid var(--glass-border)" }}
        >
          <p
            className="mb-0 text-theme-muted fw-bold text-center"
            style={{ fontSize: "0.85rem" }}
          >
            {t(
              "footer.copyright",
              "© {{year}} Zukhruf CNC Hub. All rights reserved.",
              { year: new Date().getFullYear() },
            )}
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
