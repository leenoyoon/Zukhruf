import { useState, useEffect, useCallback } from "react";
import { gcodeUploadService } from "../services/gcodeUploadService";
import { toast } from "react-toastify";
export const useGcodeUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchUploads = useCallback(async (pageNum, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      setError("");

      const data = await gcodeUploadService.getMyUploads(pageNum);

      const results = Array.isArray(data)
        ? data
        : data.results || data.data?.results || data.data || [];

      if (append) {
        setUploads((prev) => [...prev, ...(Array.isArray(results) ? results : [])]);
      } else {
        setUploads(Array.isArray(results) ? results : []);
      }

      setHasNext(Boolean(data?.next));
    } catch (err) {
      const status = err.response?.status;
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Unknown error";

      console.error("GET gcode-uploads failed:", {
        status,
        url: `${err.config?.baseURL || ""}${err.config?.url || ""}`,
        data: err.response?.data,
      });

      setError(`Failed to load uploads [${status || "network"}]: ${msg}`);
      if (!append) setUploads([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // هذا السطر الناقص — بدونه الصفحة تضل loading
  useEffect(() => {
    fetchUploads(1);
  }, [fetchUploads]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUploads(nextPage, true);
  };

  const handleUpload = async ({ gcode_file, title, x, y }) => {
    setIsUploading(true);
    setUploadError("");
    try {
      const response = await gcodeUploadService.uploadGcode({
        gcode_file,
        title,
        x,
        y,
      });
      const created = response.data?.upload || response.data || response;
      if (created?.id) {
        setUploads((prev) => [created, ...prev]);
      }
      return created;
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      const msg =
        data?.message ||
        data?.detail ||
        (data?.errors ? JSON.stringify(data.errors) : null) ||
        err.message ||
        "Upload failed.";

      console.error("POST gcode-uploads/upload failed:", {
        status,
        url: `${err.config?.baseURL || ""}${err.config?.url || ""}`,
        data,
      });

      setUploadError(`[${status || "no-response"}] ${msg}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

const handleDelete = async (id) => {
  try {
    const res = await gcodeUploadService.deleteUpload(id);
    setUploads((prev) => prev.filter((u) => u.id !== id));
    toast.success(res?.message || "Upload deleted successfully");
    return true;
  } catch (err) {
    // axios interceptor عادة بيعرض toast للخطأ
    // إذا ما ظهر، نعرض يدوي:
    if (!err.response) {
      toast.error(err.message || "Delete failed");
    }
    return false;
  }
};

  return {
    uploads,
    loading,
    error,
    hasNext,
    loadingMore,
    handleLoadMore,
    handleUpload,
    handleDelete,
    isUploading,
    uploadError,
    setUploadError,
  };
};