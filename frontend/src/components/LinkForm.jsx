import { useState } from "react";
import styles from "../styles/LinkForm.module.css";
import { useLinks } from "../hooks/useLinks";
import { useCategories } from "../hooks/useCategories";

export default function LinkForm({ onClose, editingLink }) {
  // STATE
  const [title, setTitle] = useState(editingLink?.title || "");
  const [url, setUrl] = useState(editingLink?.url || "");
  const [description, setDescription] = useState(
    editingLink?.description || ""
  );
  const [categoryId, setCategoryId] = useState(editingLink?.category_id || "");

  //TANSTACK QUERY - check hook folder
  const { categories } = useCategories();
  const { saveLink, isSaving } = useLinks();

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
      category_id: categoryId && categoryId !== "" ? categoryId : null, // Convert empty string to null for postgre
    };

    // Trigger the mutation
    saveLink(
      {
        isEditing: !!editingLink,
        linkId: editingLink?.id,
        linkData: linkData,
      },
      {
        onSuccess: () => {
          setTitle("");
          setUrl("");
          setDescription("");
          setCategoryId("");
          onClose();
        },
      }
    );
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
            disabled={isSaving.isPending}
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
            disabled={isSaving.isPending}
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
            disabled={isSaving.isPending}
          />
        </div>

        {/* Category Dropdown */}
        <div className={styles.inputGroup}>
          <label htmlFor="linkCategory">Category (Optional)</label>
          <select
            id="linkCategory"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isSaving.isPending}
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
        {isSaving.isError && (
          <div className={styles.error}>
            {isSaving.error.response?.data?.error ||
              "Failed to save link. Please try again."}
          </div>
        )}

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isSaving.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSaving.isPending}
          >
            {isSaving.isPending
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
