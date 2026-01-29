import { useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { linksAPI } from "../services/api";
import { arrayMove } from "@dnd-kit/sortable";

export const useDragReorder = (links) => {
  const queryClient = useQueryClient();
  const [tempLinks, setTempLinks] = useState(null);

  const updateMutation = useMutation({
    mutationFn: linksAPI.reorder,
    onMutate: (linksOrder) => {
      queryClient.setQueryData(["links"], (oldLinks) => {
        if (!oldLinks) return oldLinks;

        const orderMap = new Map(
          linksOrder.map((l) => [l.id, l.display_order]),
        );

        return oldLinks.map((link) => {
          const newOrder = orderMap.get(link.id);
          return newOrder !== undefined
            ? { ...link, display_order: newOrder }
            : link;
        });
      });
    },

    onError: (err) => {
      console.error("failed to reorder", err);
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  // useCallback part

  const reorder = useCallback(
    async (event) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      const reorderedLinks = arrayMove(links, oldIndex, newIndex);

      setTempLinks(reorderedLinks);

      // create payload for backend

      const linksOrder = reorderedLinks.map((link, index) => ({
        id: link.id,
        display_order: index,
      }));

      // send to backend

      await updateMutation.mutateAsync(linksOrder);
      setTempLinks(null);
    },
    [links, updateMutation],
  );

  return {
    reorder,
    dragItems: tempLinks ?? links,
  };
};
