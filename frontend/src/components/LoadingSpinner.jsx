import styles from "../styles/DashBoard.module.css";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
}
