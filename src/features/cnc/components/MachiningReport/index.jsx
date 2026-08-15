import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  FiClock,
  FiLayers,
  FiDollarSign,
  FiMove,
  FiCheckSquare,
  FiGitBranch,
  FiBox,
  FiFileText,
  FiHash,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./style.css";

// One small stat tile used in the secondary details grid below the three
// hero numbers. Kept tiny/generic on purpose so adding a new metric later
// is a one-line addition instead of a new bespoke block.
const StatTile = ({ icon: Icon, label, value }) => (
  <div className="report-stat-tile">
    <div className="report-stat-tile-icon">
      <Icon size={16} />
    </div>
    <div className="flex-grow-1 min-w-0">
      <div className="report-stat-tile-label">{label}</div>
      <div className="report-stat-tile-value">{value}</div>
    </div>
  </div>
);

// One of the three big headline numbers (time / material / cost) at the
// top of the report. `accent` just swaps the icon color so the eye can
// tell the three apart at a glance without needing three different layouts.
const HeroStat = ({ icon: Icon, label, value, sub, accent }) => (
  <Col xs={12} md={4}>
    <div className="report-hero-card">
      <div
        className="report-hero-icon"
        style={{ color: accent, backgroundColor: `${accent}1a` }}
      >
        <Icon size={22} />
      </div>
      <div className="report-hero-value">{value}</div>
      <div className="report-hero-label">{label}</div>
      {sub && <div className="report-hero-sub">{sub}</div>}
    </div>
  </Col>
);

export const MachiningReport = ({ project }) => {
  const { t } = useTranslation();
  const report = project?.processing_info?.gcode_report;

  if (!report) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 p-4 text-center">
        <div className="text-theme-muted">{t("machining_report.no_report")}</div>
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

  return (
    <div className="p-4 overflow-auto h-100">
      <div className="mb-4">
        <h6 className="fw-bold text-theme mb-1">{t("machining_report.title")}</h6>
        <small className="text-theme-muted">{t("machining_report.subtitle")}</small>
      </div>

      {/* Headline numbers */}
      <Row className="g-3 mb-4">
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
          icon={FiLayers}
          accent="#22c55e"
          label={t("machining_report.material_label")}
          value={mr ? `${mr.volume_cm3.toFixed(2)} cm³` : "—"}
          sub={
            mr
              ? mr.basis === "stepover (pocket/offset-fill)"
                ? t("machining_report.material_sub_stepover")
                : t("machining_report.material_sub_tool")
              : t("machining_report.material_unavailable")
          }
        />
        <HeroStat
          icon={FiDollarSign}
          accent="#3b82f6"
          label={t("machining_report.cost_label")}
          value={cost ? `$${cost.estimated_cost.toFixed(2)}` : "—"}
          sub={
            cost
              ? t("machining_report.cost_sub", { rate: `$${cost.machine_hourly_rate}` })
              : t("machining_report.cost_unavailable")
          }
        />
      </Row>

      {/* Secondary details grid */}
      <Row className="g-2">
        <Col xs={6} lg={4}>
          <StatTile
            icon={FiMove}
            label={t("machining_report.cutting_length")}
            value={`${report.lengths_mm?.cutting?.toFixed(0) ?? "—"} mm`}
          />
        </Col>
        <Col xs={6} lg={4}>
          <StatTile
            icon={FiMove}
            label={t("machining_report.rapid_travel")}
            value={`${(
              (report.lengths_mm?.rapid_xy || 0) + (report.lengths_mm?.rapid_z || 0)
            ).toFixed(0)} mm`}
          />
        </Col>
        {/* <Col xs={6} lg={4}>
          <StatTile
            icon={FiCheckSquare}
            label={t("machining_report.paths_processed")}
            value={`${report.paths?.processed ?? "—"} / ${report.paths?.input ?? "—"}`}
          />
        </Col> */}
        {/* <Col xs={6} lg={4}>
          <StatTile
            icon={FiGitBranch}
            label={t("machining_report.segments")}
            value={`${report.segments?.linear ?? 0} / ${report.segments?.arc ?? 0}`}
          />
        </Col> */}
        <Col xs={6} lg={4}>
          <StatTile
            icon={FiHash}
            label={t("machining_report.peak_mrr")}
            value={mrr ? `${mrr.mrr_mm3_per_min.toFixed(0)} mm³/min` : "—"}
          />
        </Col>
        <Col xs={6} lg={4}>
          <StatTile
            icon={FiFileText}
            label={t("machining_report.file_size")}
            value={`${fileSize.size_kb?.toFixed?.(1) ?? "—"} KB`}
          />
        </Col>
        {/* {bbox && (
          <Col xs={12} lg={8}>
            <StatTile
              icon={FiBox}
              label={t("machining_report.stock_size")}
              value={`${bbox.width_mm} × ${bbox.depth_mm} × ${Math.abs(bbox.height_mm)} mm`}
            />
          </Col>
        )} */}
        <Col xs={6} lg={4}>
          <StatTile
            icon={FiFileText}
            label={t("machining_report.gcode_lines")}
            value={report.total_gcode_lines ?? "—"}
          />
        </Col>
      </Row>
    </div>
  );
};
