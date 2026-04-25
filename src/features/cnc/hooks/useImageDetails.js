import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { imageService } from "../services/imageService";

export const useImageDetails = (id) => {
  const navigate = useNavigate();
  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await imageService.getImageDetails(id);
        setImageDetails(data.data || data);
      } catch (err) {
        console.error("Failed to load details", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await imageService.deleteImage(id);
        navigate("/gallery");
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return {
    imageDetails,
    loading,
    handleDelete,
  };
};