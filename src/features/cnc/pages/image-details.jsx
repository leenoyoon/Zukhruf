import React from "react";
import { Container, Row, Spinner, Button } from "react-bootstrap";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useImageDetails } from "../hooks/useImageDetails";
import { ImageDisplay } from "../components/ImageDisplay";
import { ImageInfoPanel } from "../components/ImageInfoPanel";
import { useState } from "react";
import { ConfirmDeleteModal } from "../../../shared/components/ConfirmDeleteModal";

const ImageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const { imageDetails, loading, error, handleDelete } = useImageDetails(id);

  const ArrowIcon = i18n.language === "ar" ? FiArrowRight : FiArrowLeft;

  const slideLeftVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  const [showDelete, setShowDelete] = useState(false);
const [deleting, setDeleting] = useState(false);

const askDelete = () => setShowDelete(true);

const confirmDelete = async () => {
  setDeleting(true);
  try {
    await handleDelete();
  } finally {
    setDeleting(false);
  }
};

  const slideRightVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <Container className="py-5 mt-5 d-flex justify-content-center align-items-center min-vh-50">
        <Spinner
          animation="border"
          style={{ color: "var(--primary-orange)" }}
        />
      </Container>
    );
  }

  if (error || !imageDetails) {
    return (
      <Container className="py-5 mt-5 text-center">
        <h3 className="text-danger fw-bold">{error || "Image not found"}</h3>
        <Button
          onClick={() => navigate("/gallery")}
          className="mt-3 btn-primary-custom px-4"
        >
          {i18n.language === "ar" ? "العودة للمعرض" : "Back to Gallery"}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-4">
      <Button
        variant="link"
        onClick={() => navigate("/gallery")}
        className="text-theme-muted text-decoration-none d-flex align-items-center gap-2 mb-4 p-0 fw-bold hover-orange"
      >
        <ArrowIcon size={20} />
        {i18n.language === "ar" ? "العودة للمعرض" : "Back to Gallery"}
      </Button>

      <Row className="g-5 align-items-center">
        <ImageDisplay
imageUrl={imageDetails.image_file || imageDetails.image_url}
          title={imageDetails.title}
          slideLeftVariant={slideLeftVariant}
        />
        <ImageInfoPanel
          imageDetails={imageDetails}
          handleDelete={askDelete}
          slideRightVariant={slideRightVariant}
        />
      </Row>
      <ConfirmDeleteModal
  show={showDelete}
  itemName={imageDetails?.title}
  isLoading={deleting}
  onConfirm={confirmDelete}
  onCancel={() => !deleting && setShowDelete(false)}
/>
    </Container>
  );
};

export default ImageDetailsPage;
