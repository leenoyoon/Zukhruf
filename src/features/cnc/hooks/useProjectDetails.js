import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../services/projectService";
import api from "../../../lib/axios";
import { toast } from "react-toastify";

// How often to poll GET /api/projects/<id> while status === 'processing'.
// The AI engine run happens in a Celery worker (see cnc_app/tasks.py), so
// the POST to generate-gcode/ returns 202 Accepted almost immediately with
// status:'processing' -- the real result only shows up once we poll.
const POLL_INTERVAL_MS = 3000;

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
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // Stop any in-flight polling if the user navigates away mid-generation.
  useEffect(() => stopPolling, [stopPolling]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjectDetails(id);
        const projectData = data.data || data;

        setProject(projectData);
        setEditData({
          title: projectData.title,
          dimension_x: 300,
          dimension_y: 400,
          dimension_z: -3,
        });

        // If we land on this page while a previous generation is still
        // running server-side (e.g. after a refresh), resume polling
        // instead of leaving the UI stuck on "processing" forever.
        if (projectData.status === "processing") {
          setIsGenerating(true);
          startPolling();
        } else if (
          projectData.status === "completed" &&
          projectData.gcode_file_url
        ) {
          // Project was already generated in a previous visit -- load its
          // real G-code text right away instead of leaving the terminal
          // panel showing the generic "awaiting command" placeholder.
          loadGcodePreview(projectData.gcode_file_url);
        }
      } catch {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Best-effort: once the project is 'completed', fetch the actual .gcode
  // file text so the terminal panel shows real content instead of just a
  // "done" message. Not fatal if it fails (e.g. CORS on the media host) --
  // the download button still works regardless.
  const loadGcodePreview = async (url) => {
    if (!url) return;
    try {
      // gcode_file_url points at Django's MEDIA_URL (plain static file
      // serving, no auth) -- use a bare fetch instead of the shared `api`
      // axios instance so we don't send the Authorization/Content-Type
      // headers that instance adds by default (those can trigger a CORS
      // preflight the media host isn't necessarily configured to answer).
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status} fetching G-code file`);
      }
      const text = await res.text();
      setGcodePreview(
        text.length > 3000 ? text.slice(0, 3000) + "\n...\n" : text,
      );
    } catch (err) {
      // Logged (not swallowed) so we can actually see WHY it failed --
      // CORS block, network error, wrong status, etc. -- instead of just
      // falling back to a generic message with no trace in the console.
      console.error("loadGcodePreview failed for url:", url, err);
      setGcodePreview(
        "// G-Code generated successfully.\n// Preview unavailable -- use the Download button.",
      );
    }
  };

  const applyFinalStatus = (projectData) => {
    setProject(projectData);
    if (projectData.status === "completed") {
      toast.success("G-Code generated successfully!");
      loadGcodePreview(projectData.gcode_file_url);
    } else if (projectData.status === "failed") {
      toast.error(projectData.error_message || "Failed to generate G-Code.");
      setGcodePreview(
        `// Error: ${projectData.error_message || "Failed to generate G-Code."}`,
      );
    }
    setIsGenerating(false);
    stopPolling();
  };

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const data = await projectService.getProjectDetails(id);
        const projectData = data.data || data;
        if (projectData.status === "processing") {
          setProject(projectData); // keep dimensions/title in sync while waiting
          return;
        }
        applyFinalStatus(projectData);
      } catch {
        // Transient network hiccup -- keep polling rather than giving up.
      }
    }, POLL_INTERVAL_MS);
  };

  const handleGenerateGCode = async () => {
    setIsGenerating(true);
    setGcodePreview("");
    try {
      const formData = new FormData();
      formData.append("project_id", id);
      formData.append("title", project.title);

      const response = await api.post("generate-gcode/", formData);
      // generate-gcode/ is wrapped: {status, data: {project: {...}}, message}
      // and returns 202 Accepted with status:'processing' -- there is no
      // gcode_preview/gcode_file_url in THIS response, the real result only
      // shows up once the Celery worker finishes, which we pick up by polling.
      const startedProject = response.data?.data?.project;
      if (startedProject) {
        setProject(startedProject);
      }
      startPolling();
    } catch {
      toast.error("Failed to generate G-Code.");
      setGcodePreview("// Error: Failed to generate G-Code.");
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