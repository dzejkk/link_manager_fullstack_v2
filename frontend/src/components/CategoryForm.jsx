import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI } from "../services/api";
import styles from "../styles/CategoryForm.module.css";

function CategoryForm({ onClose }) {
  // ===========================================
  // STATE - Form inputs
  // ===========================================
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");

  // ===========================================
  // REACT QUERY SETUP
  // ===========================================

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

  // ===========================================
  // FORM HANDLERS
  // ===========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    // Trigger the mutation ({ argument for mutationFn})
    createCategoryMutation.mutate({ name, color });
  };

  // ===========================================
  // RENDER
  // ===========================================

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
          <div className={styles.colorPickerContainer}>
            <input
              id="categoryColor"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={createCategoryMutation.isPending}
              className={styles.colorInput}
            />
            <span className={styles.colorPreview}>● {name || "Preview"}</span>
          </div>
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
