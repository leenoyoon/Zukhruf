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
  const [dimensions, setDimensions] = useState({ x: 300, y: 400, z: -3 });
  const [createdProjectId, setCreatedProjectId] = useState(null);

  // Tool diameter (mm) the user picks for the cutting bit. Matches the
  // backend's own default (see views.py: tool_dia_mm defaults to 2.0)
  // so the AI preview and the final project always start in sync.
  const [toolDiaMm, setToolDiaMm] = useState(2.0);

  const [aiData, setAiData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // check-coverage/ preflight -> "switch tool diameter? yes/no" modal state.
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

  // Used when arriving from an existing image (gallery / pattern library
  // "Start Project" button) instead of the drag & drop dropzone. The image
  // is already uploaded on the backend (we have its id), so we skip Step 1
  // entirely: we fetch the image bytes just so Step 1's preview card has
  // something to show, mark it as already-uploaded (uploadedImageId), and
  // land the user directly on Step 2 (CNC Setup) with AI preview available.
  const initFromExistingImage = async (existingImage) => {
    setImageDetails({
      title: existingImage.title || "",
      description: existingImage.description || "",
      is_pattern: !!existingImage.is_pattern,
    });
    setUploadedImageId(existingImage.id);

    try {
      const res = await fetch(existingImage.image_url);
      const blob = await res.blob();

      // The backend validates uploads by filename extension, not MIME type,
      // so a bare title like "pattern18" (no extension) gets rejected as
      // Unsupported image type "". Pull the real extension off the image
      // URL's path instead (strip query string/hash first), falling back
      // to .png only if the URL genuinely has none.
      const urlPath = existingImage.image_url.split(/[?#]/)[0];
      const extMatch = urlPath.match(/\.([a-zA-Z0-9]+)$/);
      const extension = extMatch ? extMatch[1].toLowerCase() : "png";
      const baseName = (existingImage.title || "image").replace(/\.[^/.]+$/, "");
      const filename = `${baseName}.${extension}`;

      const existingFile = new File([blob], filename, {
        type: blob.type || `image/${extension}`,
      });
      Object.assign(existingFile, { preview: existingImage.image_url });
      setFile(existingFile);
    } catch (err) {
      // Non-fatal: Step 2 (dimensions, AI preview, create project) still
      // works off uploadedImageId alone -- only the small Step 1 preview
      // thumbnail is affected if this fails.
      console.error("Failed to load existing image into new-project flow:", err);
    }
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
      // Send the tool diameter the user picked so the coverage/auto-switch
      // check the engine runs (see AI/pipeline.py generate_with_coverage_advice)
      // reflects the actual bit the user intends to use, not the server default.
      formData.append("tool_dia_mm", toolDiaMm);

      const response = await imageService.visualizeAI(formData);
      // ai-visualize/ wraps its payload as {status, data, message}
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
      // POST images/ is a plain (non-overridden) DRF ListCreateAPIView, so
      // it returns the created object directly -- no {status,data,message}
      // wrapper here, unlike the projects/ endpoint below.
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

  // Actually creates the project with a specific (tool_dia_mm, auto_accept)
  // pair. Called either directly (coverage was already fine) or after the
  // user answers the "switch tool diameter?" modal.
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
      // POST projects/ IS overridden on the backend (GCodeProjectListCreateView.create)
      // and returns {status, data: {...project}, message} -- the project's
      // real id lives at response.data.id, not response.id.
      const createdProject = response.data || response;
      setCreatedProjectId(createdProject.id);
      setTimeout(() => navigate("/projects"), 1500);
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Entry point wired to the "Create Project" button. Runs the fast
  // check-coverage/ preflight first (see AI/pipeline.py check_tool_coverage)
  // so the user gets asked -- instead of the engine silently auto-switching
  // the tool diameter, which is what happens by default (auto_accept_suggested_tool
  // defaults to true server-side if we don't say otherwise).
  const handleCreateProject = async () => {
    if (!uploadedImageId || !file) return;
    setIsCheckingCoverage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("x", dimensions.x);
      formData.append("y", dimensions.y);
      formData.append("tool_dia_mm", toolDiaMm);

      const response = await imageService.checkCoverage(formData);
      const coverage = response.data?.processing_info?.coverage;

      // Show the warning whenever coverage isn't ok -- whether or not the
      // backend found a smaller tool to suggest. Previously this only
      // fired when suggested_tool_mm was truthy, so a null suggestion
      // (backend has no smaller tool that fits) silently skipped straight
      // to project creation with no warning at all, even at 8% coverage.
      if (coverage && !coverage.coverage_ok) {
        setCoverageInfo(coverage);
        setShowCoverageModal(true);
        return;
      }

      // Coverage is already fine with the chosen tool -- nothing to ask.
      await submitProject({ tool_dia_mm: toolDiaMm });
    } catch (err) {
      // check-coverage/ is a preflight-only convenience call; if it fails
      // (network hiccup, etc.) don't block project creation on it -- fall
      // back to creating with whatever tool diameter the user picked.
      console.error("Coverage check failed, proceeding without it:", err);
      await submitProject({ tool_dia_mm: toolDiaMm });
    } finally {
      setIsCheckingCoverage(false);
    }
  };

  // User answered "yes, switch" on the coverage modal. Only relevant when
  // the backend actually found a smaller tool to suggest.
  const handleAcceptSuggestedTool = async () => {
    const suggested = coverageInfo?.suggested_tool_mm;
    setShowCoverageModal(false);
    if (!suggested) return;
    setToolDiaMm(suggested);
    await submitProject({ tool_dia_mm: suggested });
  };

  // User answered "no, keep my tool, create anyway" on the coverage modal
  // -- used both when a suggested tool exists and they decline it, and
  // when no suggested tool exists at all (they accept the low coverage).
  // Explicitly sends auto_accept_suggested_tool: false so the backend
  // doesn't switch the tool diameter on its own during the actual
  // generation later.
  const handleDeclineSuggestedTool = async () => {
    setShowCoverageModal(false);
    await submitProject({
      tool_dia_mm: toolDiaMm,
      auto_accept_suggested_tool: false,
    });
  };

  // User closed the modal without creating anything -- e.g. to go tweak
  // the tool diameter or adjust the source design first. Does NOT create
  // the project, unlike handleDeclineSuggestedTool.
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
  };
};