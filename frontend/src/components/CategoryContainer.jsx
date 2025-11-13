// components/CategoryContainer.jsx
import styles from "../styles/CategoryContainer.module.css";
import { SquareArrowOutUpRight } from "lucide-react";

export default function CategoryContainer({ category, links }) {
  return (
    <div className={styles.categoryGroup}>
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
    </div>
  );
}
