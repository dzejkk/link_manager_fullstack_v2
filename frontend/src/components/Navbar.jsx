import { LogOut } from "lucide-react";
import styles from "../styles/Navbar.module.css";

function Navbar({ onLogout, user }) {
  return (
    <div className={styles.navbar}>
      <div className={styles.navWrapper}>
        <div className={styles.navLeft}>
          <h1>Link Manager</h1>
        </div>
        <div className={styles.navRight}>
          <span className={styles.username}>Hello, {user.username}!</span>
          <button onClick={onLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            <p>Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
