import { useEffect, useState } from "react";

import styles from "./favorites.module.css";
import { CatObject, DataValue, FavoriteItem } from "./types";
import { fetchDataByIds } from "../../api/fetch";

export const Favorites = () => {
  const [data, setData] = useState<DataValue[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);

    const loadData = async () => {
      try {
        const result = await fetchDataByIds(
          savedFavorites.map((itemFav: CatObject) => itemFav.id)
        );
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  const toggleFavorite = (item: CatObject) => {
    const updatedFavorites = favorites.some((favItem) => favItem.id === item.id)
      ? favorites.filter((favItem) => favItem.id !== item.id)
      : [...favorites, item];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    if (favorites.some((favItem) => favItem.id === item.id)) {
      setData((prevData) => prevData.filter((cat) => cat.id !== item.id));
    }
  };

  return (
    <div className={styles.favorites}>
      <div className="container">
        <div className={styles.favorites__content}>
          {data.map((cat, index) => (
            <div key={cat.id} className={styles.card}>
              <img className={styles.card__img} src={cat.url} alt="Cat" />
              <svg
                onClick={() => toggleFavorite(cat)}
                className={`${styles.heart__icon} ${
                  favorites.some((item) => item.id === cat.id)
                    ? styles.active
                    : ""
                }`}
                viewBox="0 0 40 37"
                xmlns="http://www.w3.org/2000/svg"
                overflow="visible"
              >
                <path
                  d="M20 36.7L17.1 34.06C6.8 24.72 0 18.56 0 11C0 4.84 4.84 0 11 0C14.48 0 17.82 1.62 20 4.18C22.18 1.62 25.52 0 29 0C35.16 0 40 4.84 40 11C40 18.56 33.2 24.72 22.9 34.08L20 36.7Z"
                  stroke="#F24E1E"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
