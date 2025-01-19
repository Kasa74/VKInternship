interface Cat {
  id: string;
  url: string;
}

export interface CardProps {
  cat: Cat;
  isFavorite: boolean;
  onHeartClick?: (cat: Cat) => void;
}
