import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI, linksAPI } from "../services/api";
import styles from "../styles/LinkForm.module.css";

export default function LinkForm({ onClose, editingLink }) {
  // STATE
  const [title, setTitle] = useState(editingLink?.title || "");
  const [url, setUrl] = useState(editingLink?.url || "");
  const [description, setDescription] = useState(
    editingLink?.description || ""
  );
  const [categoryId, setCategoryId] = useState(editingLink?.category_id || "");

  //FETCH for dropdown

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesAPI.getAll,
  });

  //TANSTACK QUERY

  const queryClient = useQueryClient();

  //ONE MUTATION HADNLE UPDATE ALSO CREATE

  const saveLinkMutation = useMutation({
    mutationFn: (linkData) => {
      if (editingLink) {
        return linksAPI.update({ id: editingLink.id, ...linkData });
      }
      return linksAPI.create(linkData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });

      // reset form
      setTitle("");
      setUrl("");
      setDescription("");
      setCategoryId("");

      //close

      onClose();
    },
  });

  // ===========================================
  // FORM HANDLERS
  // ===========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      alert("Please enter a valid URL (including http:// or https://)");
      return;
    }

    // Prepare data - categoryId can be empty string (no category)
    const linkData = {
      title,
      url,
      description,
      category_id: categoryId && categoryId !== "" ? categoryId : null, // Convert empty string to null
    };

    // Trigger the mutation
    saveLinkMutation.mutate(linkData);
  };

  const isEditMode = !!editingLink;

  return (
    <div className={styles.formContainer}>
      <h3>{isEditMode ? "Edit Link" : "Create New Link"}</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Title Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="linkTitle">Title *</label>
          <input
            id="linkTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Google, GitHub, YouTube"
            disabled={saveLinkMutation.isPending}
            autoFocus
          />
        </div>

        {/* URL Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="linkUrl">URL *</label>
          <input
            id="linkUrl"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={saveLinkMutation.isPending}
          />
        </div>

        {/* Description Input (Optional) */}
        <div className={styles.inputGroup}>
          <label htmlFor="linkDescription">Description (Optional)</label>
          <textarea
            id="linkDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of this link..."
            rows={3}
            disabled={saveLinkMutation.isPending}
          />
        </div>

        {/* Category Dropdown */}
        <div className={styles.inputGroup}>
          <label htmlFor="linkCategory">Category (Optional)</label>
          <select
            id="linkCategory"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={saveLinkMutation.isPending}
            className={styles.select}
          >
            <option value="">No Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Show error if save fails */}
        {saveLinkMutation.isError && (
          <div className={styles.error}>
            {saveLinkMutation.error.response?.data?.error ||
              "Failed to save link. Please try again."}
          </div>
        )}

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={saveLinkMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={saveLinkMutation.isPending}
          >
            {saveLinkMutation.isPending
              ? "Saving..."
              : isEditMode
              ? "Update Link"
              : "Create Link"}
          </button>
        </div>
      </form>
    </div>
  );
}
