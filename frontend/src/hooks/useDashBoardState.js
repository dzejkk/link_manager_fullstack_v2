import { useState } from "react";

/**
 * Custom hook, na extrahovanie state s hlavneho componentu + handle
 */

export function useDashBoardState() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const handleCreateLink = () => {
    setEditingLink(null);
    setIsLinkModalOpen(true);
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setIsLinkModalOpen(true);
  };

  return {
    selectedCategory,
    setSelectedCategory,
    isLinkModalOpen,
    setIsLinkModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    editingLink,
    handleCreateLink,
    handleEditLink,
  };
}
