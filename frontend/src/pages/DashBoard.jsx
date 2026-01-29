import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "../styles/DashBoard.module.css";
import CategoryForm from "../components/CategoryForm";
import LinkForm from "../components/LinkForm";
import { Plus, Cross } from "lucide-react";
import Navbar from "../components/Navbar";
import SideBar from "../components/Sidebar";
import { useCategories } from "../hooks/useCategories";
import { useLinks } from "../hooks/useLinks";
import { DraggableLinkCard } from "../components/DraggableLinkCard";
import { getDomain } from "../utils/getDomain";
import { useDragReorder } from "../hooks/useDragReorder";
import { useDragReorderCategories } from "../hooks/useDragReorderCategories";
import { DraggableCategoryGroup } from "../components/DraggableCategoryGroup";
import CategoryContainer from "../components/CategoryContainer";
import {
  DndContext,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { openAllLinks } from "../utils/openAllLinks";
import Footer from "../components/Footer";

export default function DashBoard({ onLogout }) {
  // STATE
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || {});

  // TANSTACK QUERY = custom hooks
  const {
    categories,
    categoriesLoading,
    deleteCategory,
    isDeleting: isDeletingCategory,
  } = useCategories();
  const { allLinks, linksLoading, linksError, deleteLink, isDeleting } =
    useLinks();

  //Drag and drop

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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

  // Important fo showing correct number of links
  const displayedLinks =
    selectedCategory === "uncategorized"
      ? allLinks
          .filter((link) => link.category_id === null)
          .sort((a, b) => a.display_order - b.display_order)
      : selectedCategory
        ? allLinks
            .filter((link) => link.category_id === selectedCategory)
            .sort((a, b) => a.display_order - b.display_order)
        : allLinks.sort((a, b) => a.display_order - b.display_order);

  // DND
  const { reorder, dragItems } = useDragReorder(displayedLinks);
  const { reorder: reorderCategories, dragItems: sortedCategories } =
    useDragReorderCategories(categories);

  // Also sort within grouped links
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

  // Sort each group's links by display_order
  if (groupedLinks) {
    Object.keys(groupedLinks).forEach((categoryId) => {
      groupedLinks[categoryId].sort(
        (a, b) => a.display_order - b.display_order,
      );
    });
  }

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

  if (isDeleting || isDeletingCategory) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Deleting your link || category...</p>
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
          categories={sortedCategories}
          allLinks={allLinks}
          handleDeleteCategory={handleDeleteCategory}
        />
        {/* MAIN CONTENT */}
        <main className={styles.main}>
          <div className={styles.mainHeader}>
            <h2>
              {selectedCategory
                ? sortedCategories.find((c) => c.id === selectedCategory)?.name
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
              // --- GROUPED LINKS VIEW WITH DRAGGIN --- //
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={reorderCategories}
              >
                <SortableContext
                  items={sortedCategories
                    .map((cat) => cat.id)
                    .concat(["uncategorized"])}
                  strategy={rectSortingStrategy}
                >
                  {sortedCategories.map((category) => {
                    const categoryLinks = groupedLinks[category.id] || [];

                    if (categoryLinks.length === 0) return null;

                    return (
                      <DraggableCategoryGroup
                        key={category.id}
                        categoryId={category.id}
                        category={category}
                        links={categoryLinks}
                        onOpenAll={openAllLinks}
                      />
                    );
                  })}
                  {/* uncategorized section */}
                  {groupedLinks["uncategorized"] && (
                    <CategoryContainer
                      key="uncategorized"
                      categoryId="uncategorized"
                      category={{ name: "Uncategorized", color: "#ccc" }}
                      links={groupedLinks["uncategorized"]}
                      onOpenAll={openAllLinks}
                    />
                  )}
                </SortableContext>
              </DndContext>
            ) : (
              // --- SINGLE CATEGORY LINKS VIEW --- //
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={reorder}
              >
                <SortableContext
                  items={dragItems.map((link) => link.id)}
                  strategy={rectSortingStrategy}
                >
                  {dragItems.map((link) => (
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

      {/* MODALS used RADIX UI for best ACCESABILITY AND CUSTOM DESIGN */}

      {/* LINK FORM */}
      <Dialog.Root open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.modalOverlay} />
          <Dialog.Content
            className={styles.modal}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <LinkForm
              onClose={() => setIsLinkModalOpen(false)}
              editingLink={editingLink}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Category FORM */}
      <Dialog.Root
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className={styles.modalOverlay} />
          <Dialog.Content
            className={styles.modal}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <CategoryForm onClose={() => setIsCategoryModalOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Footer />
    </div>
  );
}
