import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { linksAPI, categoriesAPI } from "../services/api";
import styles from "../styles/DashBoard.module.css";
import CategoryForm from "../components/CategoryForm";
import LinkForm from "../components/LinkForm";
import {
  Pencil,
  Trash,
  Plus,
  LogOut,
  SquareArrowOutUpRight,
} from "lucide-react";
import LinkCard from "../components/LinkCard";
import CategoryContainer from "../components/CategoryContainer";

function DashBoard({ onLogout }) {
  // State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || {});

  // Fetching data with React Query //

  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"], // Unique key to identify this query
    queryFn: categoriesAPI.getAll,
  });

  const {
    data: allLinks = [],
    isLoading: linksLoading,
    error: linksError,
  } = useQuery({
    queryKey: ["links"],
    queryFn: () => linksAPI.getAll(),
  });

  // changing data - Mutations //

  const deleteLinkMutation = useMutation({
    mutationFn: (linkId) => linksAPI.delete(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId) => categoriesAPI.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });

      setSelectedCategory(null);
    },
  });

  /// Handlers ///

  const handleDeleteLink = (linkId) => {
    if (window.confirm("Are you sure to delete this link ?")) {
      deleteLinkMutation.mutate(linkId);
    }
  };

  const handleDeleteCategory = (categoriesId) => {
    if (window.confirm("Delete this category, links will be not deleted")) {
      deleteCategoryMutation.mutate(categoriesId);
    }
  };

  const handleEditLink = (link) => {
    setEditingLink(link); // Set the link to edit
    setIsLinkModalOpen(true);
  };

  const handleCreateLink = () => {
    setEditingLink(null); // Clear editing (means we're creating new)
    setIsLinkModalOpen(true);
  };

  // Important fo showing correct number of links

  const displayedLinks = selectedCategory
    ? allLinks.filter((link) => link.category_id === selectedCategory)
    : allLinks;

  // NEW Group links view - different layout for all links view

  const groupedLinks =
    selectedCategory === null
      ? allLinks.reduce((groups, link) => {
          const categoryId = link.category_id || "uncategorized";
          if (!groups[categoryId]) {
            groups[categoryId] = [];
          }
          groups[categoryId].push(link);
          return groups;
        }, {})
      : null;

  // Show loading spinner while fetching initial data
  if (categoriesLoading || linksLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your links...</p>
      </div>
    );
  }

  // Show error message if something went wrong
  if (categoriesError || linksError) {
    return (
      <div className={styles.error}>
        <h2>Oops! Something went wrong</h2>
        <p>{categoriesError?.message || linksError?.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navWrapper}>
          <div className={styles.navLeft}>
            <h1>Link Manager</h1>
          </div>
          <div className={styles.navRight}>
            <span className={styles.username}>Hello, {user.username}!</span>
            <button onClick={onLogout} className={styles.logoutBtn}>
              <LogOut size={18} />
              <p>Logout</p>
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Categories</h2>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className={styles.addBtn}
              title="Add Category"
            >
              <Plus />
            </button>
          </div>

          {/* "All Links" option */}
          <div
            className={`${styles.categoryItem} ${
              selectedCategory === null ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            <span>All Links</span>
            <span className={styles.count}>{allLinks.length}</span>
          </div>

          {/* List of categories */}

          {categories.map((category) => {
            // Count links in this category
            const linkCount = allLinks.filter(
              (link) => link.category_id === category.id
            ).length;

            return (
              <div
                key={category.id}
                className={`${styles.categoryItem} ${
                  selectedCategory === category.id ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.name}</span>
                <div className={styles.categoryActions}>
                  <span
                    style={{ background: category.color }}
                    className={styles.count}
                  >
                    {linkCount}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Don't trigger category selection
                      handleDeleteCategory(category.id);
                    }}
                    className={styles.deleteBtn}
                    title="Delete Category"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}

          {/* Show message if no categories */}
          {categories.length === 0 && (
            <p className={styles.emptyMessage}>
              No categories yet. Create one!
            </p>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.main}>
          <div className={styles.mainHeader}>
            <h2>
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : "All Links"}
            </h2>
            <button onClick={handleCreateLink} className={styles.createBtn}>
              <Plus size={18} />
              <p>Add Link</p>
            </button>
          </div>

          {/* Links Grid */}
          <div className={styles.linksGrid}>
            {allLinks.length === 0 ? (
              <div className={styles.emptyState}>
                <p>📭 No links yet</p>
                <button onClick={handleCreateLink} className={styles.createBtn}>
                  Create your first link
                </button>
              </div>
            ) : selectedCategory === null ? (
              // --- GROUPED LINKS VIEW ---
              Object.entries(groupedLinks).map(([categoryId, links]) => {
                const category = categories.find(
                  (cat) => cat.id === categoryId
                ) || {
                  name: "Uncategorized",
                  color: "#ccc",
                };

                return (
                  <CategoryContainer
                    key={categoryId}
                    category={category}
                    links={links}
                  />
                );
              })
            ) : (
              // --- SINGLE CATEGORY LINKS VIEW ---
              displayedLinks.map((link) => (
                <LinkCard
                  link={link}
                  onDelete={handleDeleteLink}
                  onEdit={handleEditLink}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {/* MODALS */}
      {isLinkModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsLinkModalOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <LinkForm
              onClose={() => setIsLinkModalOpen(false)}
              editingLink={editingLink}
            />
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <CategoryForm onClose={() => setIsCategoryModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoard;
