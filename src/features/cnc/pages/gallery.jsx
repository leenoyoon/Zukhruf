import React from "react";
import {
  Container,
  Row,
  Button,
  Card,
  Spinner,
  ButtonGroup,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiImage, FiGrid } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useGallery } from "../hooks/useGallery";
import { GalleryCard } from "../components/GalleryCard";
import { useState } from "react";
import { ConfirmDeleteModal } from "../../../shared/components/ConfirmDeleteModal";

const GalleryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    images,
    loading,
    filter,
    setFilter,
    hasNext,
    loadingMore,
    handleLoadMore,
    handleDelete,
  } = useGallery();
  const [showDelete, setShowDelete] = useState(false);
const [deleting, setDeleting] = useState(false);
const [selectedId, setSelectedId] = useState(null);
const [selectedName, setSelectedName] = useState("");

const askDelete = (id, name = "") => {
  setSelectedId(id);
  setSelectedName(name);
  setShowDelete(true);
};

const confirmDelete = async () => {
  if (!selectedId) return;
  setDeleting(true);
  try {
    await handleDelete(selectedId);
    setShowDelete(false);
    setSelectedId(null);
  } finally {
    setDeleting(false);
  }
};

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  return (
    <Container className="py-5 mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
        <div>
          <h1 className="display-5 fw-black text-theme mb-2">
            {t("gallery.title_1")}{" "}
            <span className="text-primary">{t("gallery.title_2")}</span>
          </h1>
          <p className="text-theme-muted mb-0">{t("gallery.subtitle")}</p>
        </div>
        <Button
          onClick={() => navigate("/new-project")}
          className="btn-primary-custom d-flex align-items-center justify-content-center gap-2"
        >
          <FiPlus size={20} /> {t("gallery.btn_upload")}
        </Button>
      </div>

      <div
        className="mb-4 p-1 rounded-4 d-inline-block"
        style={{
          backgroundColor: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <ButtonGroup>
          <Button
            onClick={() => setFilter("all")}
            className={`fw-bold rounded-3 px-4 py-2 d-flex align-items-center gap-2 ${filter === "all" ? "btn-primary-custom m-1" : "text-theme-muted text-decoration-none bg-transparent border-0"}`}
          >
            <FiImage /> {t("gallery.filter_all")}
          </Button>
          <Button
            onClick={() => setFilter("patterns")}
            className={`fw-bold rounded-3 px-4 py-2 d-flex align-items-center gap-2 ${filter === "patterns" ? "btn-primary-custom m-1" : "text-theme-muted text-decoration-none bg-transparent border-0"}`}
          >
            <FiGrid /> {t("gallery.filter_patterns")}
          </Button>
        </ButtonGroup>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5 my-5">
          <Spinner
            animation="grow"
            style={{ color: "var(--primary-orange)" }}
          />
        </div>
      ) : images.length === 0 ? (
        <Card
          className="text-center p-5 modern-card border-0 my-4"
          style={{
            backgroundColor: "transparent",
            border: "1px dashed var(--glass-border) !important",
          }}
        >
          <Card.Body className="py-5">
            <FiImage size={60} className="text-theme-muted mb-3 opacity-50" />
            <h4 className="text-theme fw-bold">
              {t("gallery.no_images_title")}
            </h4>
            <p className="text-theme-muted mb-0">
              {t("gallery.no_images_desc", {
                type:
                  filter === "patterns"
                    ? t("gallery.type_patterns")
                    : t("gallery.type_images"),
              })}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="g-4">
            <AnimatePresence>
              {images.map((img) => (
                <GalleryCard
                  key={img.id}
                  img={img}
                  fadeUpVariant={fadeUpVariant}
                  onDelete={(id) => askDelete(id)}
                />
              ))}
            </AnimatePresence>
          </Row>

          {hasNext && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="d-flex justify-content-center mt-5"
            >
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-5 py-2 rounded-pill fw-bold bg-transparent"
                style={{
                  borderColor: "rgba(255, 107, 0, 0.4)",
                  color: "var(--primary-orange)",
                }}
              >
                {loadingMore
                  ? t("gallery.loading")
                  : t("gallery.btn_load_more")}
              </Button>
            </motion.div>
          )}
        </>
      )}
      <ConfirmDeleteModal
  show={showDelete}
  itemName={selectedName}
  isLoading={deleting}
  onConfirm={confirmDelete}
  onCancel={() => {
    if (!deleting) {
      setShowDelete(false);
      setSelectedId(null);
    }
  }}
/>
    </Container>
  );
};

export default GalleryPage;
