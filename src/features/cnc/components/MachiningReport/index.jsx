import React, { useState } from "react";
import { Row, Col, Collapse, Button } from "react-bootstrap";
import {
  FiClock,
  FiLayers,
  FiDollarSign,
  FiMove,
  FiBox,
  FiFileText,
  FiHash,
  FiCheckSquare,
  FiGitBranch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./style.css";

const StatTile = ({ icon: IconComponent, label, value, accent }) => (
  <div className="report-stat-tile">
    <div
      className="report-stat-tile-icon"
      style={
        accent
          ? { color: accent, backgroundColor: `${accent}1a` }
          : undefined
      }
    >
      {IconComponent && <IconComponent size={16} />}
    </div>
    <div className="flex-grow-1 min-w-0">
      <div className="report-stat-tile-label">{label}</div>
      <div className="report-stat-tile-value">{value}</div>
    </div>
  </div>
);

const HeroStat = ({ icon: IconComponent, label, value, sub, accent }) => (
  <Col xs={12} sm={6} md={4}>
    <div className="report-hero-card">
      <div
        className="report-hero-icon"
        style={{ color: accent, backgroundColor: `${accent}1a` }}
      >
        {IconComponent && <IconComponent size={22} />}
      </div>
      <div className="report-hero-value">{value}</div>
      <div className="report-hero-label">{label}</div>
      {sub && <div className="report-hero-sub">{sub}</div>}
    </div>
  </Col>
);


export const MachiningReport = ({ project }) => {
  const { t } = useTranslation();
  const [showTech, setShowTech] = useState(false);
  const report = project?.processing_info?.gcode_report;

  if (!report) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 p-4 text-center">
        <div className="text-theme-muted">
          {t("machining_report.no_report")}
        </div>
      </div>
    );
  }

  const mt = report.machining_time_estimate || {};
  const mr = report.material_removal;
  const mrr = report.mrr;
  const cost = report.cost;
  const bbox = report.bounding_box;
  const fileSize = report.file_size || {};

  const rapidTotalMin =
    (mt.rapid_time_min_estimated || 0) + (mt.dwell_time_min || 0);

  const mrrHigh = Boolean(mrr?.high_mrr_warning);
  const mrrValue = mrr
    ? `${mrr.mrr_mm3_per_min.toFixed(0)} mm³/min`
    : "—";
  const mrrStatus = !mrr
    ? null
    : mrrHigh
      ? t("machining_report.mrr_status_high")
      : t("machining_report.mrr_status_safe");

  const cuttingLengthMm = report.lengths_mm?.cutting;
  const cuttingLengthDisplay =
    cuttingLengthMm == null
      ? "—"
      : cuttingLengthMm >= 1000
        ? `${(cuttingLengthMm / 1000).toFixed(2)} m`
        : `${cuttingLengthMm.toFixed(0)} mm`;

  return (
    <div className="p-4 overflow-auto h-100">
      <div className="mb-4">
        <h6 className="fw-bold text-theme mb-1">
          {t("machining_report.title")}
        </h6>
        <small className="text-theme-muted">
          {t("machining_report.subtitle")}
        </small>
      </div>

      {/* ===== صف أوضح: زمن | تكلفة | MRR ===== */}
      <Row className="g-3 mb-3">
        <HeroStat
          icon={FiClock}
          accent="#FF6B00"
          label={t("machining_report.time_label")}
          value={mt.total_time_formatted || "—"}
          sub={t("machining_report.time_sub", {
            cut: `${(mt.cutting_time_min ?? 0).toFixed(1)} min`,
            rapid: `${rapidTotalMin.toFixed(1)} min`,
          })}
        />
        <HeroStat
          icon={FiDollarSign}
          accent="#3b82f6"
          label={t("machining_report.cost_label")}
          value={cost ? `$${cost.estimated_cost.toFixed(2)}` : "—"}
          sub={
            cost
              ? t("machining_report.cost_sub", {
                  rate: `$${cost.machine_hourly_rate}`,
                })
              : t("machining_report.cost_unavailable")
          }
        />
        <HeroStat
          icon={FiHash}
          accent={mrrHigh ? "#ef4444" : "#22c55e"}
          label={t("machining_report.peak_mrr")}
          value={mrrValue}
          sub={mrrStatus || undefined}
        />
      </Row>

      {/* ===== الصف الثاني: أبعاد | مادة | طول قطع ===== */}
      <Row className="g-2 mb-3">
        <Col xs={12} sm={6} md={4}>
          <StatTile
            icon={FiBox}
            label={t("machining_report.stock_size")}
            value={
              bbox ? `${bbox.width_mm} × ${bbox.depth_mm} mm` : "—"
            }
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <StatTile
            icon={FiLayers}
            label={t("machining_report.material_label")}
            value={mr ? `${mr.volume_cm3.toFixed(2)} cm³` : "—"}
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <StatTile
            icon={FiMove}
            label={t("machining_report.cutting_length")}
            value={cuttingLengthDisplay}
          />
        </Col>
      </Row>

      {/* ===== تفاصيل فنية ===== */}
      <div className="report-tech-section">
        <Button
          variant="link"
          className="report-tech-toggle px-0 text-decoration-none"
          onClick={() => setShowTech((v) => !v)}
        >
          {showTech ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          <span className="ms-1">{t("machining_report.tech_details")}</span>
        </Button>

        <Collapse in={showTech}>
          <div>
            <Row className="g-2 mt-1">
              <Col xs={12} sm={6} lg={4}>
                <StatTile
                  icon={FiCheckSquare}
                  label={t("machining_report.paths_processed")}
                  value={`${report.paths?.processed ?? "—"} / ${
                    report.paths?.input ?? "—"
                  }`}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <StatTile
                  icon={FiHash}
                  label={t("machining_report.points")}
                  value={`${report.points?.valid ?? "—"} / ${
                    report.points?.input ?? "—"
                  }`}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <StatTile
                  icon={FiGitBranch}
                  label={t("machining_report.segments")}
                  value={`G1 ${report.segments?.linear ?? 0} / G2-G3 ${
                    report.segments?.arc ?? 0
                  }`}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <StatTile
                  icon={FiMove}
                  label={t("machining_report.rapid_xy")}
                  value={`${(report.lengths_mm?.rapid_xy ?? 0).toFixed(0)} mm`}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <StatTile
                  icon={FiMove}
                  label={t("machining_report.rapid_z")}
                  value={`${(report.lengths_mm?.rapid_z ?? 0).toFixed(0)} mm`}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <StatTile
                  icon={FiFileText}
                  label={t("machining_report.file_size")}
                  value={`${fileSize.size_kb?.toFixed?.(1) ?? "—"} KB`}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <StatTile
                  icon={FiClock}
                  label={t("machining_report.generation_time")}
                  value={
                    report.execution_time_ms != null
                      ? `${Number(report.execution_time_ms).toFixed(2)} s`
                      : "—"
                  }
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <StatTile
                  icon={FiFileText}
                  label={t("machining_report.gcode_lines")}
                  value={report.total_gcode_lines ?? "—"}
                />
              </Col>
            </Row>
          </div>
        </Collapse>
      </div>
    </div>
  );
};