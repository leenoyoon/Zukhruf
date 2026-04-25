import React from "react";
import { Col } from "react-bootstrap";
import { FiZap } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./style.css";

export const AuthHero = ({ title, subtitle, features }) => {
  const { t } = useTranslation();

  return (
    <Col
      lg={6}
      className="d-none d-lg-flex flex-column justify-content-between position-relative p-5 heroSection"
    >
      <div className="position-relative z-1">
        <div className="d-inline-flex align-items-center gap-2 mb-5">
          <div className="p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm logoIcon">
            <FiZap size={24} color="white" />
          </div>
          <h2 className="mb-0 fw-black text-white">{t("nav.brand_name")}</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1
            className="display-4 fw-black text-white mb-4"
            style={{ lineHeight: "1.2" }}
          >
            {title} <br /> <span className="text-primary">{subtitle}</span>
          </h1>
          <p
            className="h5 text-white-50 mb-5"
            style={{ maxWidth: "400px", lineHeight: "1.6" }}
          >
            {t(
              "auth.hero_desc",
              "The fastest and most precise platform to convert designs into machine-ready CNC toolpaths.",
            )}
          </p>

          <div className="d-flex flex-column gap-4 mt-5">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center gap-3 text-white-50 fw-bold"
              >
                <div className="p-3 rounded-circle featureIcon">
                  {item.icon}
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="position-relative z-1 text-white-50 small fw-bold">
        {t(
          "auth.copyright",
          "© {{year}} Zukhruf CNC Hub. All rights reserved.",
          { year: new Date().getFullYear() },
        )}
      </div>
    </Col>
  );
};
