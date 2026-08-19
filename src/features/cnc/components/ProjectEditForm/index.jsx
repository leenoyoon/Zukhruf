import React from "react";
import { Card, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { FiEdit3, FiType, FiSave } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import {
  MIN_WOOD_DIMENSION_MM,
  isValidWoodDimension,
} from "../../../../shared/utils/woodDimensions";
import "./style.css";

export const ProjectEditForm = ({
  editData,
  setEditData,
  isUpdating,
  handleUpdateProject,
}) => {
  const { t } = useTranslation();

  const inputStyle = {
    backgroundColor: "var(--bg-deep)",
    color: "var(--text-main)",
    borderColor: "var(--glass-border)",
  };

  const isWidthInvalid = !isValidWoodDimension(editData.dimension_x);
  const isHeightInvalid = !isValidWoodDimension(editData.dimension_y);
  const hasInvalidDimensions = isWidthInvalid || isHeightInvalid;

  return (
    <Card className="modern-card border-0" data-tour="pd-edit">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center gap-2 mb-4">
          <FiEdit3 size={20} className="text-primary" />
          <h6 className="fw-bold text-theme mb-0">
            {t("project_details.edit_info")}
          </h6>
        </div>

        <Alert
          id="update-success"
          variant="success"
          className="p-2 text-center rounded-3 fw-bold small"
          style={{
            opacity: 0,
            transition: "opacity 0.3s",
            position: "absolute",
            top: "-10px",
            left: 0,
            right: 0,
          }}
        >
          {t("project_details.update_success")}
        </Alert>

        <Form className="d-flex flex-column gap-3">
          {/* Project Title */}
          <Form.Group>
            <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
              <FiType /> {t("project_details.project_title")}
            </Form.Label>
            <Form.Control
              className="project-custom-input p-2 rounded-3"
              style={inputStyle}
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
          </Form.Group>

          {/* Width + Height */}
          <Row className="g-2">
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("project_details.width_x")}
                </Form.Label>
                <Form.Control
                  type="number"
                  min={MIN_WOOD_DIMENSION_MM}
                  className="project-custom-input p-2 rounded-3"
                  style={{ ...inputStyle, direction: "ltr" }}
                  value={editData.dimension_x}
                  onChange={(e) =>
                    setEditData({ ...editData, dimension_x: e.target.value })
                  }
                  isInvalid={isWidthInvalid}
                />
                <Form.Control.Feedback type="invalid">
                  {t("project_details.min_dimension_error", {
                    min: MIN_WOOD_DIMENSION_MM,
                  })}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("project_details.height_y")}
                </Form.Label>
                <Form.Control
                  type="number"
                  min={MIN_WOOD_DIMENSION_MM}
                  className="project-custom-input p-2 rounded-3"
                  style={{ ...inputStyle, direction: "ltr" }}
                  value={editData.dimension_y}
                  onChange={(e) =>
                    setEditData({ ...editData, dimension_y: e.target.value })
                  }
                  isInvalid={isHeightInvalid}
                />
                <Form.Control.Feedback type="invalid">
                  {t("project_details.min_dimension_error", {
                    min: MIN_WOOD_DIMENSION_MM,
                  })}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Cut Depth + Safe Z */}
          <Row className="g-2">
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("project_details.cut_depth")} (mm)
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  className="project-custom-input p-2 rounded-3"
                  style={{ ...inputStyle, direction: "ltr" }}
                  value={editData.dimension_z}
                  onChange={(e) =>
                    setEditData({ ...editData, dimension_z: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("project_details.safe_z")} (mm)
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0.5"
                  className="project-custom-input p-2 rounded-3"
                  style={{ ...inputStyle, direction: "ltr" }}
                  value={editData.safe_z ?? 5}
                  onChange={(e) =>
                    setEditData({ ...editData, safe_z: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Feed Rate + Plunge Rate */}
          <Row className="g-2">
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("project_details.feed_rate")} (mm/min)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="50"
                  className="project-custom-input p-2 rounded-3"
                  style={{ ...inputStyle, direction: "ltr" }}
                  value={editData.feed_rate ?? 800}
                  onChange={(e) =>
                    setEditData({ ...editData, feed_rate: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("project_details.plunge_rate")} (mm/min)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="20"
                  className="project-custom-input p-2 rounded-3"
                  style={{ ...inputStyle, direction: "ltr" }}
                  value={editData.plunge_rate ?? 300}
                  onChange={(e) =>
                    setEditData({ ...editData, plunge_rate: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Spindle + Machine Rate */}
          <Row className="g-2">
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("project_details.spindle_speed")} (RPM)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="3000"
                  step="100"
                  className="project-custom-input p-2 rounded-3"
                  style={{ ...inputStyle, direction: "ltr" }}
                  value={editData.spindle_speed ?? 12000}
                  onChange={(e) =>
                    setEditData({ ...editData, spindle_speed: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="text-theme fw-bold small">
                  {t("project_details.machine_hourly_rate")} ($/hr)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="1"
                  className="project-custom-input p-2 rounded-3"
                  style={{ ...inputStyle, direction: "ltr" }}
                  value={editData.machine_hourly_rate ?? 20}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      machine_hourly_rate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            onClick={handleUpdateProject}
            disabled={isUpdating || hasInvalidDimensions}
            variant="success"
            className="w-100 py-3 mt-2 fw-bold d-flex justify-content-center align-items-center gap-2"
            style={{
              border: "none",
              boxShadow: "0 8px 20px rgba(25, 135, 84, 0.3)",
            }}
          >
            {isUpdating ? <Spinner size="sm" /> : <FiSave size={18} />}
            {isUpdating
              ? t("project_details.saving")
              : t("project_details.save_changes")}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};