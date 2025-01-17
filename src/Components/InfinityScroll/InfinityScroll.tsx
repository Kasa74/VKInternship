import { useEffect, useState } from "react";
import { fetchData } from "../../api/fetch";
import styles from "./scroll.module.css";
import { CatObject, DataValue, FavoriteItem } from "./types";

export const InfinityScroll = () => {
  const [data, setData] = useState<DataValue[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // const loadData = async () => {
    //   try {
    //     const result = await fetchData();
    //     setData(result);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    // loadData();
    fetchMoreData();

    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      !hasMore
    ) {
      return;
    }
    fetchMoreData();
  };

  const fetchMoreData = async () => {
    try {
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?page=${page}&limit=30`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "live_HS3bvUgXt85sBag0LelWB4i0Fu3V6jtpfXlPjq9F9xUUpQrJyTmrPIwuyNO2FNCV",
          },
          method: "GET",
        }
      );
      const data = await response.json();
      setData((prevData) => [...prevData, ...data]);
      setPage((prevPage) => prevPage + 1);
      if (data.items.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  const toggleFavorite = (item: CatObject) => {
    const updatedFavorites = favorites.some((favItem) => favItem.id === item.id)
      ? favorites.filter((favItem) => favItem.id !== item.id)
      : [...favorites, item];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className={styles.scroll}>
      <div className="container">
        <div className={styles.scroll__content}>
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
