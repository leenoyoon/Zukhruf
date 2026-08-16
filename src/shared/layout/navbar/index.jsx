import React from "react";
import { Navbar, Nav, Container, Image, Stack, Button } from "react-bootstrap";
import {
  FiMoon,
  FiSun,
  FiSettings,
  FiLogOut,
  FiZap,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useThemeContext } from "../../theme";
import { authService } from "../../../features/auth/services/authService";
import "./style.css";
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";
import { useAuth } from "../../../features/auth/context/AuthContext";

const CustomNavbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeContext();
  const { isLoggedIn, username, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await authService.logout();
      } catch (err) {
        console.error(err);
      } finally {
        logout();
        navigate("/");
      }
    }
  };
  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };
  return (
    <Navbar expand="lg" fixed="top" className="py-3 glass-navbar">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="d-flex align-items-center gap-2 cursor-pointer"
        >
          <div
            className="p-2 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              background: "linear-gradient(135deg, #FF6B00, #FF8A00)",
              boxShadow: "0 4px 15px rgba(255,107,0,0.3)",
            }}
          >
            <FiZap size={22} color="white" />
          </div>
          <span className="fw-black h3 mb-0 text-theme">
            {t("nav.brand_name")}
          </span>
        </Navbar.Brand>

        <Navbar.Toggle className="border-0 bg-transparent" />

        <Navbar.Collapse id="main-nav">
          <Nav className="mx-auto gap-4">
            {["home", "gallery", "projects", "simulator"].map((key, i) => {
              const paths = ["/home", "/gallery", "/projects", "/simulator"];
              const isActive = location.pathname === paths[i];
              return (
                <Nav.Link
                  key={i}
                  onClick={() => navigate(paths[i])}
                  className={`nav-link-custom text-theme fw-bold transition-all px-2 ${isActive ? "opacity-100" : "opacity-75"}`}
                >
                  {t(`nav.${key}`)}
                </Nav.Link>
              );
            })}
          </Nav>

          <Stack
            direction="horizontal"
            gap={3}
            className="align-items-center mt-3 mt-lg-0"
          >
            <div
              onClick={toggleLanguage}
              className="hover-icon hover-orange fw-bold d-flex align-items-center gap-1 cursor-pointer"
              title="Change Language"
            >
              <FiGlobe size={20} />
              <span className="small">
                {i18n.language === "ar" ? "EN" : "AR"}
              </span>
            </div>

            <div
              onClick={toggleTheme}
              className="hover-icon hover-orange cursor-pointer"
              title="Toggle Theme"
            >
              {mode === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </div>

            {isLoggedIn ? (
              <>
                <div
                  onClick={() => navigate("/settings")}
                  className="hover-icon hover-orange"
                  title="Settings"
                >
                  <FiSettings size={20} />
                </div>
                <div
                  onClick={handleLogout}
                  className="hover-icon hover-red"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </div>
                <div
                  className="d-flex align-items-center gap-2 ms-2 ps-3 border-start border-secondary border-opacity-25 cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  <span className="small fw-bold text-theme d-none d-sm-block">
                    {username}
                  </span>
                  <Image
                    src={`https://ui-avatars.com/api/?name=${username}&background=FF6B00&color=fff`}
                    roundedCircle
                    width={35}
                    height={35}
                  />
                </div>
              </>
            ) : (
              <Stack direction="horizontal" gap={2} className="ms-lg-3">
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-theme fw-bold text-decoration-none d-flex align-items-center gap-1 px-3"
                >
                  <FiLogIn /> {t("nav.login")}
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="btn-primary-custom d-flex align-items-center gap-1 py-2 px-4 shadow-sm"
                >
                  <FiUserPlus /> {t("nav.register")}
                </Button>
              </Stack>
            )}
          </Stack>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
