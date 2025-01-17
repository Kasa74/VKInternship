import { Link, useLocation } from "react-router-dom";
import styles from "./header.module.css";

export const Header = () => {
  const location = useLocation();
  return (
    <header className={styles.header}>
      <div className="container">
        <nav className={styles.nav}>
          <ul className={styles.nav__list}>
            <Link to="/">
              <li
                className={`${styles.nav__item} ${
                  location.pathname === "/" ? styles.active : ""
                }`}
              >
                Все котики
              </li>
            </Link>
            <Link to="/favorites">
              <li
                className={`${styles.nav__item} ${
                  location.pathname === "/favorites" ? styles.active : ""
                }`}
              >
                Любимые котики
              </li>
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
};
