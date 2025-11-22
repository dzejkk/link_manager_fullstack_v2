import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { linksAPI, categoriesAPI } from "../services/api";
import styles from "../styles/DashBoard.module.css";
import CategoryForm from "../components/CategoryForm";
import LinkForm from "../components/LinkForm";
import { Plus } from "lucide-react";
import LinkCard from "../components/LinkCard";
import CategoryContainer from "../components/CategoryContainer";
import Navbar from "../components/Navbar";
import SideBar from "../components/Sidebar";

function DashBoard({ onLogout }) {
  // STATE
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || {});

  // TANSTACK QUERY

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

  /// HANDLERS ///

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

  const displayedLinks =
    selectedCategory === "uncategorized"
      ? allLinks.filter((link) => link.category_id === null)
      : selectedCategory
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
      <Navbar onLogout={onLogout} user={user} />

      <div className={styles.container}>
        {/* SIDEBAR */}
        <SideBar
          setIsCategoryModalOpen={setIsCategoryModalOpen}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          categories={categories}
          allLinks={allLinks}
          handleDeleteCategory={handleDeleteCategory}
        />

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
                  key={link.id}
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
