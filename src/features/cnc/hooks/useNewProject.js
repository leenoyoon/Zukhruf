import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { imageService } from "../services/imageService";
import { projectService } from "../services/projectService";
import { isValidWoodDimension } from "../../../shared/utils/woodDimensions";
import { pickMediaUrl } from "../../../shared/mediaUrl";
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
  const [dimensions, setDimensions] = useState({ x: 300, y: 400, z: -3 });
  const [createdProjectId, setCreatedProjectId] = useState(null);

  // إعدادات التشغيل
  const [feedRate, setFeedRate] = useState(800);
  const [plungeRate, setPlungeRate] = useState(300);
  const [spindleSpeed, setSpindleSpeed] = useState(12000);
  const [safeZ, setSafeZ] = useState(5.0);
  const [machineHourlyRate, setMachineHourlyRate] = useState(20);

  const [toolDiaMm, setToolDiaMm] = useState(2.0);
  const [stepOverRatio, setStepOverRatio] = useState(0.6);

  const [aiData, setAiData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [coverageInfo, setCoverageInfo] = useState(null);
  const [showCoverageModal, setShowCoverageModal] = useState(false);
  const [isCheckingCoverage, setIsCheckingCoverage] = useState(false);

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

 const initFromExistingImage = async (existingImage) => {
    setImageDetails({
      title: existingImage.title || "",
      description: existingImage.description || "",
      is_pattern: !!existingImage.is_pattern,
    });
    setUploadedImageId(existingImage.id);

    try {
      const imgSrc = pickMediaUrl(
        existingImage.image_file,
        existingImage.image_url,
      );
      if (!imgSrc) {
        console.error("No usable image URL on existingImage", existingImage);
        return;
      }

      const res = await fetch(imgSrc);
      if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.status}`);
      }
      const blob = await res.blob();

      const urlPath = imgSrc.split(/[?#]/)[0];
      const extMatch = urlPath.match(/\.([a-zA-Z0-9]+)$/);
      const extension = extMatch ? extMatch[1].toLowerCase() : "png";
      const baseName = (existingImage.title || "image").replace(/\.[^/.]+$/, "");
      const filename = `${baseName}.${extension}`;

      const existingFile = new File([blob], filename, {
        type: blob.type || `image/${extension}`,
      });
      Object.assign(existingFile, {
        preview: URL.createObjectURL(blob),
      });
      setFile(existingFile);
    } catch (err) {
      console.error(
        "Failed to load existing image into new-project flow:",
        err,
      );
    }
  };

  const handleAIPreview = async () => {
    if (!file || !uploadedImageId) return;
    if (
      !isValidWoodDimension(dimensions.x) ||
      !isValidWoodDimension(dimensions.y)
    ) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("image_id", uploadedImageId);
      formData.append("x", dimensions.x);
      formData.append("y", dimensions.y);
      formData.append("tool_dia_mm", toolDiaMm);
      formData.append("step_over_ratio", stepOverRatio);

      const response = await imageService.checkCoverage(formData);
      setAiData(response.data);
    } catch (err) {
      console.error("AI Preview (check-coverage) failed:", err);
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

  const buildCuttingSettings = (overrides = {}) => ({
    tool_dia_mm: toolDiaMm,
    step_over_ratio: stepOverRatio,
    feed_rate: Number(feedRate),
    plunge_rate: Number(plungeRate),
    spindle_speed: Number(spindleSpeed),
    safe_z: Number(safeZ),
    machine_hourly_rate: Number(machineHourlyRate),
    ...overrides,
  });

  const submitProject = async (cuttingSettings) => {
    setIsCreatingProject(true);
    try {
      const response = await projectService.createProject({
        title: imageDetails.title + " - CNC",
        image: uploadedImageId,
        dimension_x: dimensions.x,
        dimension_y: dimensions.y,
        dimension_z: dimensions.z,
        cutting_settings: cuttingSettings,
      });
      const createdProject = response.data || response;
      setCreatedProjectId(createdProject.id);
      navigate(`/project/${createdProject.id}`);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleCreateProject = async () => {
    if (!uploadedImageId) return;
    if (
      !isValidWoodDimension(dimensions.x) ||
      !isValidWoodDimension(dimensions.y)
    ) {
      return;
    }

    const coverage = aiData?.processing_info?.coverage;

    // إذا التغطية غير كافية وفيه أداة مقترحة → اسأل المستخدم
    if (
      coverage &&
      coverage.coverage_ok === false &&
      coverage.suggested_tool_mm != null
    ) {
      setCoverageInfo(coverage);
      setShowCoverageModal(true);
      return;
    }

    // وإلا أنشئ مباشرة
    await submitProject(buildCuttingSettings());
  };

  const handleAcceptSuggestedTool = async () => {
    const suggested = coverageInfo?.suggested_tool_mm;
    setShowCoverageModal(false);
    if (!suggested) return;
    setToolDiaMm(suggested);
    await submitProject(
      buildCuttingSettings({
        tool_dia_mm: suggested,
      }),
    );
  };

  const handleDeclineSuggestedTool = async () => {
    setShowCoverageModal(false);
    await submitProject(
      buildCuttingSettings({
        auto_accept_suggested_tool: false,
      }),
    );
  };

  const handleCancelCreation = () => {
    setShowCoverageModal(false);
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
    toolDiaMm,
    setToolDiaMm,
    onDrop,
    handleUpload,
    handleCreateProject,
    resetFile,
    initFromExistingImage,
    aiData,
    isAnalyzing,
    handleAIPreview,
    coverageInfo,
    showCoverageModal,
    isCheckingCoverage,
    handleAcceptSuggestedTool,
    handleDeclineSuggestedTool,
    handleCancelCreation,
    stepOverRatio,
    setStepOverRatio,
    feedRate,
    setFeedRate,
    plungeRate,
    setPlungeRate,
    spindleSpeed,
    setSpindleSpeed,
    safeZ,
    setSafeZ,
    machineHourlyRate,
    setMachineHourlyRate,
  };
};