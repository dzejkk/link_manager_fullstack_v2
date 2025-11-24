// components/CategoryContainer.jsx
import styles from "../styles/CategoryContainer.module.css";
import { SquareArrowOutUpRight, GalleryHorizontalEnd } from "lucide-react";
import { openAllLinks } from "../utils/openAllLinks";

export default function CategoryContainer({ category, links }) {
  return (
    <div
      className={styles.categoryGroup}
      style={{ "--hover-color": category.color }}
    >
      <h3
        className={styles.groupTitle}
        style={{ borderLeft: `4px solid ${category.color || "#ccc"}` }}
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
        onClick={() => openAllLinks(links)}
      >
        open all
        <GalleryHorizontalEnd size={14} />
      </button>
    </div>
  );
}
