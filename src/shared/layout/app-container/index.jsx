import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar";
import Footer from "../footer";
import { motion, AnimatePresence } from "framer-motion";
import { AppTour } from "../../../shared/tour";

const AppContainer = () => {
  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <div className="bg-mesh" />

      <Navbar />
            <AppTour />


      <Container
        fluid="lg"
        as="main"
        className="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5"
        style={{
          paddingTop: "140px",
          paddingBottom: "2rem",
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="wait">
          <div
            as={motion.div}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="w-100"
          >
            <Outlet />
          </div>
        </AnimatePresence>
      </Container>
      <Footer />
    </div>
  );
};

export default AppContainer;
