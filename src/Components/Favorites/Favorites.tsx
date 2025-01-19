import { useEffect, useState } from "react";

import styles from "./favorites.module.css";
import { CatObject, DataValue, FavoriteItem } from "./types";
import { fetchDataByIds } from "../../api/fetch";
import { Card } from "../Card/Card";

export const Favorites = () => {
  const [data, setData] = useState<DataValue[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);

    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchDataByIds(
          savedFavorites.map((itemFav: CatObject) => itemFav.id)
        );
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
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
            <Card
              key={cat.id}
              cat={cat}
              isFavorite={favorites.some((item) => item.id === cat.id)}
              onHeartClick={() => toggleFavorite(cat)}
            />
          ))}
          {isLoading && (
            <div className={styles.loader__block}>
              ... загружаем избранных котиков ...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
