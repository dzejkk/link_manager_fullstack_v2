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
  };
}
