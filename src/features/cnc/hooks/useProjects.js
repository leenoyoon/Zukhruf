import { useState, useEffect } from "react";
import { projectService } from "../services/projectService";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProjects = async (pageNum, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      setError("");

      const data = await projectService.getMyProjects(pageNum);

      if (append) {
        setProjects((prev) => [...prev, ...data.results]);
      } else {
        setProjects(data.results);
      }

      setHasNext(data.next !== null);
    } catch (err) {
      setError("Failed to load projects from server.");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjects(nextPage, true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this project?",
      )
    ) {
      try {
        await projectService.deleteProject(id);
        setProjects((prevProjects) =>
          prevProjects.filter((proj) => proj.id !== id),
        );
      } catch {
        alert("Failed to delete project from server.");
      }
    }
  };

  return {
    projects,
    loading,
    error,
    hasNext,
    loadingMore,
    handleLoadMore,
    handleDelete,
  };
};
