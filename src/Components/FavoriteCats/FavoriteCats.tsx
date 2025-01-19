import { useEffect, useState } from "react";

import styles from "./favorites.module.css";
import { Cat } from "./types";
import { fetchCatsByIds } from "../../api/fetch";
import { Card } from "../Card/Card";

export const FavoriteCats = () => {
  const [data, setData] = useState<Cat[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);

    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchCatsByIds(
          savedFavorites.map((itemFav: string) => itemFav)
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

  const toggleFavorite = (item: Cat) => {
    const updatedFavorites = favorites.some((favItem) => favItem === item.id)
      ? favorites.filter((favItem) => favItem !== item.id)
      : [...favorites, item.id];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    if (favorites.some((favItem) => favItem === item.id)) {
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
              isFavorite={favorites.some((item) => item === cat.id)}
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
