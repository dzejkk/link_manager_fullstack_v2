import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../styles/DraggableLinkCard.module.css";

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
  };

  return (
    <div>
      <div
        ref={setNodeRef}
        style={style}
        className={styles.linkCard}
        {...attributes}
        {...listeners}
      >
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
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkUrl}
            onClick={(e) => e.stopPropagation()}
          >
            {link.url}
          </a>
        </div>
        <div className={styles.linkFooter}>
          <span className={styles.date}>
            Added {new Date(link.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
