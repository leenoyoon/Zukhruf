import React from "react";
import { Container, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useSettings";
import { ProfileOverview } from "../components/ProfileOverview";
import { PasswordChangeForm } from "../components/PasswordChangeForm";

const SettingsPage = () => {
  const { t } = useTranslation();
  const {
    profile,
    passwords,
    setPasswords,
    loading,
    fetching,
    handlePasswordChange,
  } = useSettings();

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (fetching)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner
          animation="grow"
          style={{ color: "#FF6B00", width: "3rem", height: "3rem" }}
        />
      </Container>
    );

  return (
    <Container className="py-5 mt-4" style={{ maxWidth: "800px" }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="mb-5"
      >
        <h1 className="display-5 fw-black text-theme mb-2">
          {t("settings.page_title_1")}{" "}
          <span className="text-primary">{t("settings.page_title_2")}</span>
        </h1>
        <p className="text-theme-muted">{t("settings.page_subtitle")}</p>
      </motion.div>

      <div className="d-flex flex-column gap-4">
        <motion.div initial="hidden" animate="visible" variants={fadeUpVariant}>
          <ProfileOverview profile={profile} />
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUpVariant}>
          <PasswordChangeForm
            passwords={passwords}
            setPasswords={setPasswords}
            loading={loading}
            handlePasswordChange={handlePasswordChange}
          />
        </motion.div>
      </div>
    </Container>
  );
};

export default SettingsPage;
