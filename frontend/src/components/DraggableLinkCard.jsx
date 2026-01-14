import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../styles/DraggableLinkCard.module.css";
import { Grip, Pen, Trash } from "lucide-react";

export function DraggableLinkCard({ link, onEdit, onDelete, getDomain }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const defaultTransition = "border-color 0.2s ease-in";

  const combinedTransition = transition
    ? `${transition}, ${defaultTransition}`
    : undefined;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: combinedTransition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
    boxShadow: isDragging ? "0 8px 24px rgba(0, 0, 0, 0.2)" : undefined,
    willChange: "transform",
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.linkCard}>
      <div className={styles.linkHeader}>
        <img
          src={`https://www.google.com/s2/favicons?domain=${getDomain(
            link.url
          )}&sz=32`}
          alt="favicon"
          className={styles.favicon}
          onError={(e) => (e.target.style.display = "none")}
        />
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
            <Pen size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(link.id);
            }}
            className={styles.deleteBtn}
            title="Delete"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
      {link.description && (
        <p className={styles.description}>{link.description}</p>
      )}
      <div className={styles.linkUrlContainer}>
        <a
          href={link.url}
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
          <Grip size={18} />
        </div>
      </div>
    </div>
  );
}
