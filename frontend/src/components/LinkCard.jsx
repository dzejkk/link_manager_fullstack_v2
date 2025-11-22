import styles from "../styles/LinkCard.module.css";
import { Pencil, Trash, SquareArrowOutUpRight } from "lucide-react";
import { getDomain } from "../utils/getDomain";

const LinkCard = ({ link, onEdit, onDelete }) => {
  return (
    <div>
      <div key={link.id} className={styles.linkCard}>
        <div className={styles.linkHeader}>
          {/* Favicon */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${getDomain(
              link.url
            )}&sz=32`}
            alt="favicon"
            className={styles.favicon}
            onError={(e) => (e.target.style.display = "none")} // Hide if fails to load
          />
          <h3>{link.title}</h3>
          <div className={styles.linkActions}>
            <button
              onClick={() => onEdit(link)}
              className={styles.editBtn}
              title="Edit"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(link.id)}
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

        {/* Link */}

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkUrl}
        >
          <SquareArrowOutUpRight
            size={16}
            style={{
              verticalAlign: "middle",
              paddingInlineEnd: "0.25rem",
            }}
          />
          {link.url.slice(0, 30)}
        </a>

        <div className={styles.linkFooter}>
          <span className={styles.date}>
            Added {new Date(link.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
