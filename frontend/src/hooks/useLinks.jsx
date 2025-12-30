import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { linksAPI } from "../services/api";

export function useLinks() {
  const queryClient = useQueryClient();

  // fetch
  const {
    data: allLinks = [],
    isLoading: linksLoading,
    error: linksError,
  } = useQuery({
    queryKey: ["links"],
    queryFn: () => linksAPI.getAll(),
  });

  // create + update
  const saveLinkMutation = useMutation({
    mutationFn: ({ isEditing, linkId, linkData }) => {
      if (isEditing && linkId) {
        return linksAPI.update({ id: linkId, ...linkData });
      }
      return linksAPI.create(linkData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  // delete
  const deleteLinkMutation = useMutation({
    mutationFn: (linkId) => linksAPI.delete(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  // Reorder links mutation with optimistic updates

  const reorderLinksMutation = useMutation({
    mutationFn: linksAPI.reorder,

    onMutate: async (linksOrder) => {
      console.log("🔵 onMutate - Reordering:", linksOrder);

      await queryClient.cancelQueries({ queryKey: ["links"] });
      const previousLinks = queryClient.getQueryData(["links"]);

      console.log(
        "🔵 Previous links:",
        previousLinks?.map((l) => ({ id: l.id, order: l.display_order }))
      );

      queryClient.setQueryData(["links"], (oldLinks) => {
        if (!oldLinks) return oldLinks;

        const orderMap = new Map(
          linksOrder.map((l) => [l.id, l.display_order])
        );

        const updated = oldLinks.map((link) => {
          const newOrder = orderMap.get(link.id);
          return newOrder !== undefined
            ? { ...link, display_order: newOrder }
            : link;
        });

        console.log(
          "🟢 Updated links:",
          updated.map((l) => ({ id: l.id, order: l.display_order }))
        );
        return updated;
      });

      return { previousLinks };
    },

    onError: (err, linksOrder, context) => {
      console.log("❌ Error! Rolling back...");
      if (context?.previousLinks) {
        queryClient.setQueryData(["links"], context.previousLinks);
      }
      console.error("Failed to reorder:", err);
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return {
    allLinks,
    linksLoading,
    linksError,

    //actions
    saveLink: saveLinkMutation.mutate,
    deleteLink: deleteLinkMutation.mutate,

    // states
    isSaving: saveLinkMutation.isPending,
    isDeleting: deleteLinkMutation.isPending,

    //reorder
    reorderLinks: reorderLinksMutation.mutate,
  };
}
