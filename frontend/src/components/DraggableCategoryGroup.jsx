import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import styles from "../styles/DraggableCategoryGroup.module.css";
import {
  SquareArrowOutUpRight,
  GalleryHorizontalEnd,
  Grip,
} from "lucide-react";

export function DraggableCategoryGroup({
  categoryId,
  category,
  links,
  onOpenAll,
  setSelectedCategory,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: categoryId });

  const [hovered, setHovered] = useState(false);

  const defaultTransition =
    "box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out";

  const combinedTransition = transition
    ? `${transition}, ${defaultTransition}`
    : undefined;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: combinedTransition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
    boxShadow: isDragging ? "0 8px 24px rgba(0, 0, 0, 0.2)" : undefined,
    willChange: isDragging ? "auto" : "transform",
  };

  return (
    <div>
      <div
        className={styles.categoryGroup}
        style={{ ...style, "--hover-color": category.color }}
        ref={setNodeRef}
      >
        <h3
          className={styles.groupTitle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderLeft: `4px solid ${category.color || "#ccc"}`,
            borderLeftWidth: hovered ? "16px" : "4px",
          }}
          onClick={() => setSelectedCategory(categoryId)}
        >
          {category.name || "Uncategorized"}
        </h3>

        <ul className={styles.compactList}>
          {links.map((link) => (
            <li key={link.id} className={styles.compactItem}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.compactLink}
                title={link.title}
              >
                <SquareArrowOutUpRight size={14} />
                <span className={styles.linkTitle}>{link.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <button
          className={styles.categoryBtnOpenMultipleLinks}
          onClick={() => onOpenAll(links)}
        >
          open all
          <GalleryHorizontalEnd size={14} />
        </button>
        <div className={styles.grabber} {...attributes} {...listeners}>
          <Grip size={18} />
        </div>
      </div>
    </div>
  );
}
