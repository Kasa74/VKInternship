interface Cat {
  id: string;
  url: string;
  width: number;
  height: number;
}

export interface CardProps {
  cat: Cat;
  isFavorite: boolean;
  onHeartClick?: (cat: Cat) => void;
}
