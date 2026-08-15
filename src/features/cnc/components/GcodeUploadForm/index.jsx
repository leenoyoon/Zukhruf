import React, { useCallback, useState } from "react";
import { Card, Form, Button, Spinner, Row, Col, Alert } from "react-bootstrap";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import {
  MIN_WOOD_DIMENSION_MM,
  isValidWoodDimension,
} from "../../../../shared/utils/woodDimensions";
import "./style.css";

export const GcodeUploadForm = ({
  onSubmit,
  isUploading,
  uploadError,
  onClearError,
}) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [dimensions, setDimensions] = useState({ x: 300, y: 300 });

  const onDrop = useCallback((accepted) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setTitle((prev) => prev || f.name.replace(/\.[^/.]+$/, ""));
    onClearError?.();
  }, [onClearError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/plain": [".nc", ".gcode", ".txt"],
      "application/octet-stream": [".nc", ".gcode"],
    },
  });

  const widthInvalid = !isValidWoodDimension(dimensions.x);
  const heightInvalid = !isValidWoodDimension(dimensions.y);
  const canSubmit =
    file &&
    title.trim() &&
    !widthInvalid &&
    !heightInvalid &&
    !isUploading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const created = await onSubmit({
      gcode_file: file,
      title: title.trim(),
      x: dimensions.x,
      y: dimensions.y,
    });
    if (created) {
      setFile(null);
      setTitle("");
      setDimensions({ x: 300, y: 300 });
    }
  };

  const inputStyle = {
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-main)",
    borderColor: "var(--glass-border)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="modern-card border-0 p-3 p-md-4">
        <Card.Body>
          <h5 className="fw-bold text-theme mb-3 d-flex align-items-center gap-2">
            <FiUploadCloud className="text-primary" />
            {t("simulator.upload_title")}
          </h5>

          {uploadError && (
            <Alert
              variant="danger"
              className="rounded-4"
              onClose={onClearError}
              dismissible
            >
              {uploadError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <div
              {...getRootProps()}
              className={`gcode-dropzone rounded-4 p-4 text-center mb-3 ${
                isDragActive ? "is-active" : ""
              } ${file ? "has-file" : ""}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                  <FiFileText size={22} className="text-primary" />
                  <span className="text-theme fw-bold">{file.name}</span>
                  <Button
                    type="button"
                    variant="link"
                    className="text-danger p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <FiX size={18} />
                  </Button>
                </div>
              ) : (
                <>
                  <FiUploadCloud
                    size={36}
                    className="text-theme-muted mb-2 opacity-75"
                  />
                  <p className="text-theme mb-1 fw-bold">
                    {t("simulator.drag_drop")}
                  </p>
                  <small className="text-theme-muted">
                    {t("simulator.accepted_types")}
                  </small>
                </>
              )}
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="text-theme-muted fw-bold small">
                {t("simulator.field_title")}
              </Form.Label>
              <Form.Control
                style={inputStyle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("simulator.field_title_placeholder")}
              />
            </Form.Group>

            <Row className="g-3 mb-4">
              <Col xs={12} sm={6}>
                <Form.Label className="text-theme-muted fw-bold small">
                  {t("simulator.width_x")}
                </Form.Label>
                <Form.Control
                  type="number"
                  style={inputStyle}
                  value={dimensions.x}
                  isInvalid={widthInvalid}
                  onChange={(e) =>
                    setDimensions((d) => ({
                      ...d,
                      x: Number(e.target.value),
                    }))
                  }
                />
                {widthInvalid && (
                  <Form.Text className="text-danger">
                    {t("simulator.min_dimension_error", {
                      min: MIN_WOOD_DIMENSION_MM,
                    })}
                  </Form.Text>
                )}
              </Col>
              <Col xs={12} sm={6}>
                <Form.Label className="text-theme-muted fw-bold small">
                  {t("simulator.height_y")}
                </Form.Label>
                <Form.Control
                  type="number"
                  style={inputStyle}
                  value={dimensions.y}
                  isInvalid={heightInvalid}
                  onChange={(e) =>
                    setDimensions((d) => ({
                      ...d,
                      y: Number(e.target.value),
                    }))
                  }
                />
                {heightInvalid && (
                  <Form.Text className="text-danger">
                    {t("simulator.min_dimension_error", {
                      min: MIN_WOOD_DIMENSION_MM,
                    })}
                  </Form.Text>
                )}
              </Col>
            </Row>

            <Button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary-custom w-100 py-2 fw-bold d-flex justify-content-center align-items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Spinner size="sm" /> {t("simulator.uploading")}
                </>
              ) : (
                <>
                  <FiUploadCloud size={18} /> {t("simulator.upload_btn")}
                </>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};