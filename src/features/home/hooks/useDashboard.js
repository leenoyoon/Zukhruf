import { useState, useEffect } from "react";
import { imageService } from "../../cnc/services/imageService";

export const useDashboard = () => {
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const data = await imageService.getAllPatterns(1);

        setPatterns(data.results.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch patterns:", err);
      }
    };
    fetchPatterns();
  }, []);

  return { patterns };
};
