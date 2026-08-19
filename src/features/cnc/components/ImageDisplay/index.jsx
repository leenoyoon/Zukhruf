import React from "react";
import { Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "./style.css";

export const ImageDisplay = ({ imageUrl, title, slideLeftVariant }) => {
  return (
    <Col
      xs={12}
      lg={7}
      as={motion.div}
      variants={slideLeftVariant}
      initial="hidden"
      animate="visible"
    >
      <Card className="modern-card border-0 p-3 h-100 d-flex align-items-center justify-content-center img-display-card" data-tour="gd-preview">
        <img src={imageUrl} alt={title} className="img-display-img" />
      </Card>
    </Col>
  );
};
