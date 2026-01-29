import { useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { categoriesAPI } from "../services/api";
import { arrayMove } from "@dnd-kit/sortable";

export const useDragReorderCategories = (categories) => {
  const queryClient = useQueryClient();
  const [tempCategories, setTempCategories] = useState(null);

  const updateMutation = useMutation({
    mutationFn: categoriesAPI.reorder,
    onMutate: async (categoriesOrder) => {
      // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // 2. Snapshot the previous value
      const previousCategories = queryClient.getQueryData(["categories"]);

      // 3. Optimistically update to the new value
      queryClient.setQueryData(["categories"], (oldCategories) => {
        if (!oldCategories) return [];

        const orderMap = new Map(
          categoriesOrder.map((c) => [c.id, c.display_order]),
        );

        const newCategories = oldCategories.map((category) => {
          const newOrder = orderMap.get(category.id);
          return newOrder !== undefined
            ? { ...category, display_order: newOrder }
            : category;
        });

        // CRITICAL FIX: Sort the array so the cache order matches the visual order
        return newCategories.sort((a, b) => a.display_order - b.display_order);
      });

      // Return context for rollback
      return { previousCategories };
    },
    onError: (err, newTodo, context) => {
      console.error("Failed to reorder categories:", err);
      // Rollback to the previous value if error occurs
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server sync
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const reorder = useCallback(
    async (event) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);

      const reorderedCategories = arrayMove(categories, oldIndex, newIndex);

      // Set temp state (Visual feedback)
      setTempCategories(reorderedCategories);

      const categoriesOrder = reorderedCategories.map((category, index) => ({
        id: category.id,
        display_order: index,
      }));

      // Send to backend
      try {
        await updateMutation.mutateAsync(categoriesOrder);
      } finally {
        // Clear temp state
        setTempCategories(null);
      }
    },
    [categories, updateMutation],
  );

  return {
    reorder,
    dragItems: tempCategories ?? categories,
  };
};
