import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../services/projectService";
import api from "../../../lib/axios";
import { toast } from "react-toastify";

export const useProjectDetails = (id) => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    dimension_x: 0,
    dimension_y: 0,
    dimension_z: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [gcodePreview, setGcodePreview] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjectDetails(id);
        const projectData = data.data || data;

        setProject(projectData);
        setEditData({
          title: projectData.title,
          dimension_x: projectData.dimension_x,
          dimension_y: projectData.dimension_y,
          dimension_z: projectData.dimension_z,
        });
      } catch {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleUpdateProject = async () => {
    setIsUpdating(true);
    try {
      const response = await projectService.updateProject(id, editData);
      const updatedProject = response.data || response;
      setProject(updatedProject);

      const successAlert = document.getElementById("update-success");
      if (successAlert) {
        successAlert.style.opacity = 1;
        setTimeout(() => {
          successAlert.style.opacity = 0;
        }, 3000);
      }
    } catch {
      toast.error("Failed to update project.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.deleteProject(id);
        toast.success("Project deleted successfully.");
        navigate("/projects");
      } catch {
        toast.error("Failed to delete project.");
      }
    }
  };

  const handleGenerateGCode = async () => {
    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("project_id", id);
      formData.append("title", project.title);

      const response = await api.post("generate-gcode/", formData);

      setGcodePreview(
        response.data.gcode_preview ||
          "// G-Code generated successfully...\n// Ready for download.",
      );

      if (response.data.gcode_file_url) {
        setProject((prev) => ({
          ...prev,
          gcode_file_url: response.data.gcode_file_url,
          status: "completed",
        }));
      }

      toast.success("G-Code generated successfully!");
    } catch {
      toast.error("Failed to generate G-Code.");
      setGcodePreview("// Error: Failed to generate G-Code.");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    project,
    loading,
    error,
    editData,
    setEditData,
    isUpdating,
    isGenerating,
    gcodePreview,
    handleUpdateProject,
    handleDeleteProject,
    handleGenerateGCode,
  };
};
