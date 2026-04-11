import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiGithub, FiMail, FiChevronRight, FiZap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const siteLinks = [
    { label: "Home Dashboard", path: "/dashboard" },
    { label: "Explore Gallery", path: "/gallery" },
    { label: "Create New Project", path: "/new-project" },
    { label: "Project History", path: "/history" },
  ];

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
      <style>{`
        .footer-link {
          color: var(--text-muted-custom);
          transition: all 0.3s ease;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
        }
        .footer-link svg { transition: transform 0.3s ease; margin-right: 8px; }
        .footer-link:hover { color: var(--primary-orange) !important; transform: translateX(10px); }
        .footer-link:hover svg { transform: translateX(5px); }

        .social-btn {
          background-color: var(--bg-surface);
          color: var(--text-muted-custom);
          border: 1px solid var(--glass-border);
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
        }
        .social-btn:hover {
          background-color: var(--primary-orange);
          color: white !important;
          transform: translateY(-8px) scale(1.1);
          box-shadow: 0 12px 25px rgba(255, 107, 0, 0.4);
        }
      `}</style>

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
              <h3 className="mb-0 fw-black text-theme">Zukhruf </h3>
            </div>
            <p
              className="text-theme-muted fw-bold mb-4"
              style={{ lineHeight: "1.8", fontSize: "0.95rem" }}
            >
              The ultimate engineering platform for image processing and G-Code
              generation. Built for precision and creators.
            </p>
          </Col>

          <Col xs={12} md={3} lg={3}>
            <h5 className="fw-black text-theme mb-4 position-relative d-inline-block">
              Quick Links
              <div
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: 0,
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
                  <FiChevronRight size={18} /> {link.label}
                </div>
              ))}
            </div>
          </Col>

          <Col xs={12} md={4} lg={3}>
            <h5 className="fw-black text-theme mb-4 position-relative d-inline-block">
              Connect With Us
              <div
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: 0,
                  width: "40%",
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: "var(--primary-orange)",
                }}
              />
            </h5>
            <p className="text-theme-muted fw-bold small mb-4 mt-3">
              Have questions or feedback? Feel free to reach out.
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
            © {new Date().getFullYear()} Zukhruf CNC Hub. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
