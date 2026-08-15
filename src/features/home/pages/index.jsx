import React from "react";
import { useDashboard } from "../hooks/useDashboard";
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/StatsSection";
import { StepsSection } from "../components/StepsSection";
import { PatternsSection } from "../components/PatternsSection";
import { CtaSection } from "../components/CtaSection";

const HomePage = () => {
  const { patterns } = useDashboard();

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="pb-5" style={{ overflowX: "hidden" }}>
      <div className="bg-mesh" />
      <HeroSection fadeUpVariant={fadeUpVariant} />
      <FeaturesSection />
      <StepsSection
        fadeUpVariant={fadeUpVariant}
        staggerContainer={staggerContainer}
      />
      <PatternsSection
        patterns={patterns}
        fadeUpVariant={fadeUpVariant}
        staggerContainer={staggerContainer}
      />
      <CtaSection fadeUpVariant={fadeUpVariant} />
    </div>
  );
};

export default HomePage;
