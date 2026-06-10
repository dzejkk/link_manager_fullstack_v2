import { Plus } from "lucide-react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import styles from "../styles/DashBoard.module.css";
import { DraggableLinkCard } from "./DraggableLinkCard";
import { DraggableCategoryGroup } from "./DraggableCategoryGroup";
import CategoryContainer from "./CategoryContainer";
import { getDomain } from "../utils/getDomain";
import { openAllLinks } from "../utils/openAllLinks";

export default function MainContent({
  selectedCategory,
  sortedCategories,
  allLinks,
  displayedLinks,
  groupedLinks,
  sensors,
  reorder,
  reorderCategories,
  onCreateLink,
  onEditLink,
  onDeleteLink,
  setSelectedCategory,
}) {
  const categoryName = selectedCategory
    ? sortedCategories.find((c) => c.id === selectedCategory)?.name
    : "All Links";

  return (
    <main className={styles.main}>
      <div className={styles.mainHeader}>
        <h2>{categoryName}</h2>
        <button onClick={onCreateLink} className={styles.createBtn}>
          <Plus size={18} />
          <p>Add Link</p>
        </button>
      </div>

      <div className={styles.linksGrid}>
        {allLinks.length === 0 ? (
          <EmptyState onCreateLink={onCreateLink} />
        ) : selectedCategory === null ? (
          <GroupedLinksView
            sortedCategories={sortedCategories}
            groupedLinks={groupedLinks}
            sensors={sensors}
            reorderCategories={reorderCategories}
            setSelectedCategory={setSelectedCategory}
          />
        ) : (
          <SingleCategoryView
            displayedLinks={displayedLinks}
            sensors={sensors}
            reorder={reorder}
            onEditLink={onEditLink}
            onDeleteLink={onDeleteLink}
          />
        )}
      </div>
    </main>
  );
}

function EmptyState({ onCreateLink }) {
  return (
    <div className={styles.emptyState}>
      <button onClick={onCreateLink} className={styles.createBtnEmptyState}>
        Create your first link
        <Plus />
      </button>
    </div>
  );
}

function GroupedLinksView({
  sortedCategories,
  groupedLinks,
  sensors,
  reorderCategories,
  setSelectedCategory,
}) {
  const categoryIds = sortedCategories
    .map((cat) => cat.id)
    .concat(["uncategorized"]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={reorderCategories}
    >
      <SortableContext items={categoryIds} strategy={rectSortingStrategy}>
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
              setSelectedCategory={setSelectedCategory}
            />
          );
        })}

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
  );
}

function SingleCategoryView({
  displayedLinks,
  sensors,
  reorder,
  onEditLink,
  onDeleteLink,
}) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={reorder}
    >
      <SortableContext
        items={displayedLinks.map((link) => link.id)}
        strategy={rectSortingStrategy}
      >
        {displayedLinks.map((link) => (
          <DraggableLinkCard
            key={link.id}
            link={link}
            onEdit={onEditLink}
            onDelete={onDeleteLink}
            getDomain={getDomain}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
