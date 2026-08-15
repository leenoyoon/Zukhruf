import { useState, useEffect } from "react";
import { imageService } from "../services/imageService";

export const useGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchImages = async (pageNum, currentFilter, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const isPattern = currentFilter === "patterns" ? true : null;
      const data = await imageService.getMyImages(pageNum, isPattern);

      if (append) {
        setImages((prev) => [...prev, ...data.results]);
      } else {
        setImages(data.results);
      }
      setHasNext(data.next !== null);
    } catch (err) {
      console.error("Failed to fetch images", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchImages(1, filter, false);
  }, [filter]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, filter, true);
  };

const handleDelete = async (id) => {
  try {
    await imageService.deleteImage(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
  } catch (err) {
    console.error("Delete failed", err);
  }
};

  return {
    images,
    loading,
    filter,
    setFilter,
    hasNext,
    loadingMore,
    handleLoadMore,
    handleDelete,
  };
};
