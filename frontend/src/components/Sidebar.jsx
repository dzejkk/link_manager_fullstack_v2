import styles from "../styles/Sidebar.module.css";
import { Plus } from "lucide-react";

const SideBar = ({
  setIsCategoryModalOpen,
  setSelectedCategory,
  selectedCategory,
  allLinks,
  categories,
  handleDeleteCategory,
}) => {
  return (
    <div>
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

        {/* NEW - place for uncategorized links */}

        {allLinks.filter((link) => link.category_id === null).length > 0 && (
          <div
            className={`${styles.categoryItem} ${
              selectedCategory === "uncategorized" ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory("uncategorized")}
          >
            <span style={{ color: "var(--ring)" }}>● Uncategorized</span>
            <span className={styles.count}>
              {allLinks.filter((link) => link.category_id === null).length}
            </span>
          </div>
        )}

        {/* Show message if no categories */}
        {categories.length === 0 && (
          <p className={styles.emptyMessage}>No categories yet. Create one!</p>
        )}
      </aside>

      {/* Mobile view*/}

      <div className={styles.mobileView}>
        <select
          value={selectedCategory || "all"}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "all") setSelectedCategory(null);
            else if (value === "uncategorized")
              setSelectedCategory("uncategorized");
            else setSelectedCategory(value);
          }}
        >
          <option value="all">All Links ({allLinks.length})</option>
          {categories.map((category) => {
            const linkCount = allLinks.filter(
              (link) => link.category_id === category.id
            ).length;
            return (
              <option key={category.id} value={category.id}>
                {category.name} ({linkCount})
              </option>
            );
          })}
          {allLinks.filter((link) => link.category_id === null).length > 0 && (
            <option value="uncategorized">
              Uncategorized (
              {allLinks.filter((link) => link.category_id === null).length})
            </option>
          )}
        </select>
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className={styles.mobileAddBtn}
          title="Add Category"
        >
          <Plus size={16} color="white" />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
