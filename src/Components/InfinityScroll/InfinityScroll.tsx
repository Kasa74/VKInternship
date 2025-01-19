import { useEffect, useRef, useState } from "react";
import { fetchDataByPage } from "../../api/fetch";
import styles from "./scroll.module.css";
import { CatObject, DataValue, FavoriteItem } from "./types";
import { Card } from "../Card/Card";

export const InfinityScroll = () => {
  const [data, setData] = useState<DataValue[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMoreData();

    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    if (!lastItemRef.current || !hasMore) return;

    const observer = observerRef.current;
    if (observer) observer.disconnect();

    const newObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          fetchMoreData();
        }
      },
      { threshold: 0 }
    );

    newObserver.observe(lastItemRef.current);
    observerRef.current = newObserver;

    return () => newObserver.disconnect();
  }, [data, hasMore, isLoading]);

  const fetchMoreData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDataByPage(page);
      setData((prevData) => [...prevData, ...data]);
      setPage((prevPage) => prevPage + 1);
      if (data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (item: CatObject) => {
    const updatedFavorites = favorites.some((favItem) => favItem.id === item.id)
      ? favorites.filter((favItem) => favItem.id !== item.id)
      : [...favorites, item];
    setFavorites(updatedFavorites);
    try {
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (e) {
      if (e instanceof DOMException && e.code === 22) {
        alert(
          "В хранилище localStorage недостаточно места. Попробуйте убрать карточки из избранного!"
        );
      }
    }
  };

  return (
    <div className={styles.scroll}>
      <div className="container">
        <div className={styles.scroll__content}>
          {data.map((cat, index) => {
            const isLastItem = index + 1 === data.length;
            return (
              <Card
                key={cat.id + index}
                cat={cat}
                isFavorite={favorites.some((item) => item.id === cat.id)}
                onHeartClick={() => toggleFavorite(cat)}
                ref={isLastItem ? lastItemRef : null}
              />
            );
          })}
          {isLoading && (
            <div className={styles.loader__block}>
              ... загружаем еще котиков ...
            </div>
          )}
          {!hasMore && !isLoading && (
            <div className={styles.end__block}>{`Котики закончились (((`}</div>
          )}
        </div>
      </div>
    </div>
  );
};
