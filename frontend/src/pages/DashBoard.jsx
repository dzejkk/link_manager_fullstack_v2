import * as Dialog from "@radix-ui/react-dialog";
import styles from "../styles/DashBoard.module.css";
import CategoryForm from "../components/CategoryForm";
import LinkForm from "../components/LinkForm";
import Navbar from "../components/Navbar";
import SideBar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useCategories } from "../hooks/useCategories";
import { useLinks } from "../hooks/useLinks";
import { useDashBoardState } from "../hooks/useDashBoardState";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import MainContent from "../components/MainContent";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function DashBoard({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Data fetching
  const {
    categories,
    categoriesLoading,
    deleteCategory,
    isDeleting: isDeletingCategory,
  } = useCategories();

  const { allLinks, linksLoading, linksError, deleteLink, isDeleting } =
    useLinks();

  // UI state management (extracted to custom hook)
  const {
    selectedCategory,
    setSelectedCategory,
    isLinkModalOpen,
    setIsLinkModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    editingLink,
    handleCreateLink,
    handleEditLink,
  } = useDashBoardState();

  // Drag and drop logic (extracted to custom hook)
  const {
    sensors,
    displayedLinks,
    groupedLinks,
    sortedCategories,
    reorder,
    reorderCategories,
  } = useDragAndDrop({
    allLinks,
    categories,
    selectedCategory,
  });

  // Event handlers
  const handleDeleteLink = (linkId) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      deleteLink(linkId, {
        onSuccess: () => {
          // After deletion, check if current category is now empty
          if (selectedCategory !== null) {
            // Get remaining links in this category
            const remainingLinks = displayedLinks.filter(
              (link) => link.id !== linkId,
            );

            // If no links left in this category, show all links
            if (remainingLinks.length === 0) {
              setSelectedCategory(null);
            }
          }
        },
      });
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Delete this category? Links will not be deleted.")) {
      deleteCategory(categoryId);
      setSelectedCategory(null);
    }
  };

  // Loading and error states
  if (categoriesLoading || linksLoading) {
    return <LoadingSpinner message="Loading your links..." />;
  }

  if (linksError) {
    return <ErrorMessage error={linksError} />;
  }

  if (isDeleting || isDeletingCategory) {
    return <LoadingSpinner message="Deleting..." />;
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

        <MainContent
          selectedCategory={selectedCategory}
          sortedCategories={sortedCategories}
          allLinks={allLinks}
          displayedLinks={displayedLinks}
          groupedLinks={groupedLinks}
          sensors={sensors}
          reorder={reorder}
          reorderCategories={reorderCategories}
          onCreateLink={handleCreateLink}
          onEditLink={handleEditLink}
          onDeleteLink={handleDeleteLink}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Link Modal */}
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
              selectedCategory={selectedCategory}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Category Modal */}
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
