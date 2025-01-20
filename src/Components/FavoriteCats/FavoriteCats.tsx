import { useEffect, useState, useRef } from "react";
import styles from "./favorites.module.css";
import { Cat } from "./types";
import { fetchCatsByIds } from "../../api/fetch";
import { Card } from "../Card/Card";

const ITEMS_PER_PAGE = 20;

export const FavoriteCats = () => {
  const [data, setData] = useState<Cat[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);

    if (savedFavorites.length > 0) {
      loadMoreData(1, savedFavorites);
    } else {
      setHasMore(false);
    }
  }, []);

  useEffect(() => {
    if (!lastItemRef.current || !hasMore) return;

    const observer = observerRef.current;
    if (observer) observer.disconnect();

    const newObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMoreData(page, favorites);
        }
      },
      { threshold: 0.1 }
    );

    newObserver.observe(lastItemRef.current);
    observerRef.current = newObserver;

    return () => newObserver.disconnect();
  }, [data, hasMore, isLoading, page, favorites]);

  const loadMoreData = async (
    currentPage: number,
    savedFavorites: string[]
  ) => {
    setIsLoading(true);
    try {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;

      const idsToLoad = savedFavorites.slice(start, end);
      if (idsToLoad.length === 0) {
        setHasMore(false);
        return;
      }

      const result = await fetchCatsByIds(idsToLoad);
      setData((prevData) => [...prevData, ...result]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          {favorites.length === 0 && (
            <div className={styles.favorite__empty}>
              Вы еще не добавили никого в своих избранных котиков!
            </div>
          )}
          {data.map((cat, index) => {
            const isLastItem = index + 1 === data.length;
            return (
              <Card
                key={cat.id + index}
                cat={cat}
                isFavorite={favorites.some((item) => item === cat.id)}
                onHeartClick={() => toggleFavorite(cat)}
                ref={isLastItem ? lastItemRef : null}
              />
            );
          })}
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
