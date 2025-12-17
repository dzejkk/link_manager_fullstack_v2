import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../styles/DraggableLinkCard.module.css";
import { Grip } from "lucide-react";

export function DraggableLinkCard({ link, onEdit, onDelete, getDomain }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto", // ← Bring to front while dragging
    boxShadow: isDragging ? "0 8px 24px rgba(0, 0, 0, 0.2)" : undefined,
  };

  return (
    <div>
      <div ref={setNodeRef} className={styles.linkCard} style={style}>
        <div className={styles.linkHeader}>
          <h3>{link.title}</h3>
          <div className={styles.linkActions}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(link);
              }}
              className={styles.editBtn}
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(link.id);
              }}
              className={styles.deleteBtn}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
        {link.description && (
          <p className={styles.description}>{link.description}</p>
        )}
        <div className={styles.linkUrlContainer}>
          <img
            src={`https://www.google.com/s2/favicons?domain=${getDomain(
              link.url
            )}&sz=32`}
            alt="favicon"
            className={styles.favicon}
            onError={(e) => (e.target.style.display = "none")}
          />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkUrl}
            onClick={(e) => e.stopPropagation()}
          >
            {link.url.slice(0, 29)}
          </a>
        </div>
        <div className={styles.linkFooter}>
          <span className={styles.date}>
            Added {new Date(link.created_at).toLocaleDateString()}
          </span>
          <div className={styles.graber} {...attributes} {...listeners}>
            <Grip />
          </div>
        </div>
      </div>
    </div>
  );
}
