import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gcodeUploadService } from "../services/gcodeUploadService";
import { toast } from "react-toastify";
export const useGcodeUploadDetails = (id) => {
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await gcodeUploadService.getUploadDetails(id);
        // الرد كائن مباشر: { id, title, ... }
        // احتياط إذا انلفّ لاحقًا
        const uploadData = data?.data?.upload || data?.data || data;
        if (!cancelled) {
          if (uploadData?.id) setUpload(uploadData);
          else {
            setError("Upload not found");
            setUpload(null);
          }
        }
      } catch (err) {
        console.error("GET gcode-uploads details failed:", {
          status: err.response?.status,
          data: err.response?.data,
        });
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load upload details.",
          );
          setUpload(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [id]);
const handleDelete = async () => {
  setIsDeleting(true);
  try {
    const res = await gcodeUploadService.deleteUpload(id);

    // لازم قبل الـ navigate
    toast.success(res?.message || "Upload deleted successfully");

    // تأخير بسيط حتى يظهر الـ toast قبل ما الصفحة تنفك
    setTimeout(() => {
      navigate("/simulator");
    }, 300);

    return true;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      "Delete failed";
    toast.error(msg);
    return false;
  } finally {
    setIsDeleting(false);
  }
};

  return {
    upload,
    loading,
    error,
    isDeleting,
    handleDelete,
  };
};