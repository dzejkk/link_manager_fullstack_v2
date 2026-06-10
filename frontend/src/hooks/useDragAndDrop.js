import { useMemo } from "react";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useDragReorder } from "./useDragReorder";
import { useDragReorderCategories } from "./useDragReorderCategories";

/**
 * Custom hook to manage all drag and drop functionality
 * Consolidates sensors, sorting, and grouping logic
 */
export function useDragAndDrop({ allLinks, categories, selectedCategory }) {
  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Calculate displayed links based on selected category
  const displayedLinks = useMemo(() => {
    if (selectedCategory === "uncategorized") {
      return allLinks
        .filter((link) => link.category_id === null)
        .sort((a, b) => a.display_order - b.display_order);
    }

    if (selectedCategory) {
      return allLinks
        .filter((link) => link.category_id === selectedCategory)
        .sort((a, b) => a.display_order - b.display_order);
    }

    return allLinks.sort((a, b) => a.display_order - b.display_order);
  }, [allLinks, selectedCategory]);

  // Group links by category when viewing all
  const groupedLinks = useMemo(() => {
    if (selectedCategory !== null) return null;

    const groups = allLinks.reduce((acc, link) => {
      const categoryId = link.category_id || "uncategorized";
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(link);
      return acc;
    }, {});

    // Sort each group's links by display_order
    Object.keys(groups).forEach((categoryId) => {
      groups[categoryId].sort((a, b) => a.display_order - b.display_order);
    });

    return groups;
  }, [allLinks, selectedCategory]);

  // Drag reordering hooks
  const { reorder, dragItems } = useDragReorder(displayedLinks);
  const { reorder: reorderCategories, dragItems: sortedCategories } =
    useDragReorderCategories(categories);

  return {
    sensors,
    displayedLinks: dragItems,
    groupedLinks,
    sortedCategories,
    reorder,
    reorderCategories,
  };
}
