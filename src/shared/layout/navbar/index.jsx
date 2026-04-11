import React from "react";
import { Navbar, Nav, Container, Image, Stack } from "react-bootstrap";
import { FiMoon, FiSun, FiSettings, FiLogOut, FiZap } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useThemeContext } from "../../theme";
import { authService } from "../../../features/auth/services/authService";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeContext();
  const username = localStorage.getItem("username") || "User";
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await authService.logout();
      navigate("/login");
    }
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
          <Stack direction="horizontal" gap={2} className="align-items-center">
            <span className="fw-black h3 mb-0 text-theme">Zukhruf</span>
          </Stack>
        </Navbar.Brand>

        <Navbar.Toggle className="border-0 bg-transparent" />

        <Navbar.Collapse id="main-nav">
          <Nav className="mx-auto gap-4">
            {["Home", "Gallery", "History"].map((label, i) => {
              const paths = ["/dashboard", "/gallery", "/history"];
              const isActive = location.pathname === paths[i];
              return (
                <Nav.Link
                  key={i}
                  onClick={() => navigate(paths[i])}
                  className={`nav-link-custom text-theme fw-bold transition-all px-2 ${isActive ? "opacity-100" : "opacity-75"}`}
                >
                  {label}
                </Nav.Link>
              );
            })}
          </Nav>

          <Stack
            direction="horizontal"
            gap={3}
            className="align-items-center mt-3 mt-lg-0"
          >
            <style>{`
              .hover-icon { transition: all 0.3s ease; cursor: pointer; color: var(--text-muted-custom); }
              .hover-orange:hover { color: #FF6B00 !important; transform: translateY(-2px); }
              .hover-red:hover { color: #ff4d4d !important; transform: translateY(-2px); }
            `}</style>

            <div
              onClick={toggleTheme}
              className="hover-icon hover-orange"
              title="Toggle Theme"
            >
              {mode === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </div>

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
          </Stack>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
