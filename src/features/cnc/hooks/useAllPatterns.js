import { useState, useEffect } from "react";
import { imageService } from "../services/imageService";

export const useAllPatterns = () => {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchPatterns = async (pageNumber) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setIsLoadingMore(true);

      const data = await imageService.getAllPatterns(pageNumber);

      if (pageNumber === 1) {
        setPatterns(data.results);
      } else {
        setPatterns((prev) => [...prev, ...data.results]);
      }

      setHasNext(data.next !== null);
      setPage(pageNumber);
    } catch {
      setError("Failed to load patterns from server.");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPatterns(1);
  }, []);

  const loadMore = () => {
    if (hasNext && !isLoadingMore) {
      fetchPatterns(page + 1);
    }
  };

  return { patterns, loading, error, hasNext, isLoadingMore, loadMore };
};
