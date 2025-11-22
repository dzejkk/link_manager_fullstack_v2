import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI } from "../services/api";

export function useCategories() {
  const queryClient = useQueryClient();

  // fetch
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error,
  } = useQuery({
    queryKey: ["categories"], // Unique key to identify this query
    queryFn: categoriesAPI.getAll,
  });

  // Create
  const createCategoryMutation = useMutation({
    mutationFn: (categoryData) => categoriesAPI.create(categoryData),

    onSuccess: () => {
      // 1. Invalidate categories query - tells React Query to refetch
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
    },
  });

  // delete
  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId) => categoriesAPI.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return {
    categories,
    categoriesLoading,
    error,
    createCategoryMutation,

    //actions
    createCategory: createCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,

    // Mutation states ( if you need them )
    isCreating: createCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
}
