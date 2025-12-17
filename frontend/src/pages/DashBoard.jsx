import { useState } from "react";
import styles from "../styles/DashBoard.module.css";
import CategoryForm from "../components/CategoryForm";
import LinkForm from "../components/LinkForm";
import { Plus } from "lucide-react";
import LinkCard from "../components/LinkCard";
import CategoryContainer from "../components/CategoryContainer";
import Navbar from "../components/Navbar";
import SideBar from "../components/Sidebar";
import { useCategories } from "../hooks/useCategories";
import { useLinks } from "../hooks/useLinks";
import { DraggableLinkCard } from "../components/DraggableLinkCard";
import { getDomain } from "../utils/getDomain";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useSensor,
  useSensors,
  defaultKeyboardCoordinateGetter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function DashBoard({ onLogout }) {
  // STATE
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || {});

  // TANSTACK QUERY = custom hooks
  const { categories, categoriesLoading, deleteCategory } = useCategories();
  const { allLinks, linksLoading, linksError, deleteLink, reorderLinks } =
    useLinks();

  //Drag and drop

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /// HANDLERS ///

  const handleDeleteLink = (linkId) => {
    if (window.confirm("Are you sure to delete this link ?")) {
      deleteLink(linkId);
    }
  };

  const handleDeleteCategory = (categoriesId) => {
    if (window.confirm("Delete this category, links will be not deleted")) {
      deleteCategory(categoriesId);
      setSelectedCategory(null);
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

  // drag and drop

  // Add this function inside Dashboard component
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return; // Nothing changed
    }

    const oldIndex = displayedLinks.findIndex((link) => link.id === active.id);
    const newIndex = displayedLinks.findIndex((link) => link.id === over.id);

    const reorderedLinks = arrayMove(displayedLinks, oldIndex, newIndex);

    // Create the payload for backend
    const linksOrder = reorderedLinks.map((link, index) => ({
      id: link.id,
      display_order: index,
    }));

    reorderLinks(linksOrder);
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
  if (categoriesLoading || linksError) {
    return (
      <div className={styles.error}>
        <h2>Oops! Something went wrong</h2>
        <p>{categoriesLoading?.message || linksError?.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Navbar onLogout={onLogout} user={user} />
      <div className={styles.container}>
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
                <button
                  onClick={handleCreateLink}
                  className={styles.createBtnEmptyState}
                >
                  Create your first link
                  <Plus />
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={displayedLinks.map((link) => link.id)}
                  strategy={rectSortingStrategy}
                >
                  {displayedLinks.map((link) => (
                    <DraggableLinkCard
                      key={link.id}
                      link={link}
                      onEdit={handleEditLink}
                      onDelete={handleDeleteLink}
                      getDomain={getDomain}
                    />
                  ))}
                </SortableContext>
              </DndContext>
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
