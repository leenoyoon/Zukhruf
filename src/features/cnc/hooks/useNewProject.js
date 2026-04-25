import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { imageService } from "../services/imageService";
import { projectService } from "../services/projectService";

export const useNewProject = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageDetails, setImageDetails] = useState({
    title: "",
    description: "",
    is_pattern: false,
  });
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [dimensions, setDimensions] = useState({ x: 100, y: 100, z: 10 });
  const [createdProjectId, setCreatedProjectId] = useState(null);

  const [aiData, setAiData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(
        Object.assign(uploadedFile, {
          preview: URL.createObjectURL(uploadedFile),
        }),
      );
      setImageDetails((prev) => ({
        ...prev,
        title: uploadedFile.name.split(".")[0],
      }));
      setAiData(null);
    }
  }, []);

  const resetFile = () => {
    setFile(null);
    setUploadedImageId(null);
    setAiData(null);
    setImageDetails({ title: "", description: "", is_pattern: false });
  };

  const handleAIPreview = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("x", dimensions.x);
      formData.append("y", dimensions.y);
      formData.append("z", dimensions.z);

      const response = await imageService.visualizeAI(formData);
      setAiData(response.data);
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const data = await imageService.uploadImage({
        title: imageDetails.title,
        description: imageDetails.description,
        image_file: file,
        is_pattern: imageDetails.is_pattern,
      });
      setUploadedImageId(data.id);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!uploadedImageId) return;
    setIsCreatingProject(true);
    try {
      const data = await projectService.createProject({
        title: imageDetails.title + " - CNC",
        image: uploadedImageId,
        dimension_x: dimensions.x,
        dimension_y: dimensions.y,
        dimension_z: dimensions.z,
      });
      setCreatedProjectId(data.id);
      setTimeout(() => navigate("/projects"), 1500);
    } finally {
      setIsCreatingProject(false);
    }
  };

  return {
    file,
    isUploading,
    imageDetails,
    setImageDetails,
    uploadedImageId,
    isCreatingProject,
    dimensions,
    setDimensions,
    createdProjectId,
    onDrop,
    handleUpload,
    handleCreateProject,
    resetFile,
    aiData,
    isAnalyzing,
    handleAIPreview,
  };
};
