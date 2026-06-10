import styles from "../styles/DashBoard.module.css";

export default function ErrorMessage({ error }) {
  return (
    <div className={styles.error}>
      <h2>Oops! Something went wrong</h2>
      <p>{error?.message || "An unexpected error occurred"}</p>
    </div>
  );
}
