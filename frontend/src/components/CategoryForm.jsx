import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI } from "../services/api";
import styles from "../styles/CategoryForm.module.css";
import ColorPicker from "./ColorPicker";

const palette = [
  "#e3dacc", // bezova
  "#bcd1ca", // kaktus
  "#cbcadb", // purplish
  "#6a9bcc", // bluish
  "#788c5d", // greenish
  "#c46686", // violetish
  "#bfc0bb", // gray
];

function CategoryForm({ onClose }) {
  // STATE
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");

  // REACT QUERY SETUP
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: (categoryData) => categoriesAPI.create(categoryData),

    onSuccess: () => {
      // 1. Invalidate categories query - tells React Query to refetch
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      setName("");
      setColor("#3b82f6");
      onClose();
    },

    onError: (error) => {
      console.error("Failed to create category:", error);
    },
  });

  // FORM HANDLERS
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    // Trigger the mutation ({ argument for mutationFn})
    createCategoryMutation.mutate({ name, color });
  };

  return (
    <div className={styles.formContainer}>
      <h3>Create New Category</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Category Name Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="categoryName">Category Name *</label>
          <input
            id="categoryName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Work, Personal, Hobbies"
            disabled={createCategoryMutation.isPending}
            autoFocus
          />
        </div>

        {/* Color Picker */}
        <div className={styles.inputGroup}>
          <label htmlFor="categoryColor">Color</label>
          <ColorPicker value={color} onChange={setColor} colors={palette} />
          <p>Selected color" {color}</p>
        </div>

        {/* Show error if creation fails */}
        {createCategoryMutation.isError && (
          <div className={styles.error}>
            {createCategoryMutation.error.response?.data?.error ||
              "Failed to create category. Please try again."}
          </div>
        )}

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={createCategoryMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={createCategoryMutation.isPending}
          >
            {createCategoryMutation.isPending
              ? "Creating..."
              : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;
