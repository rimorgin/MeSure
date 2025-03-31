export interface FavoritesStorage {
  favorites: number[]; // Array of FavoritesItem objects
  fetchFavorites: (favorites: any) => Promise<void>;
  addFavorite: (userId: string, favoriteId: number) => Promise<void>;
  removeFavorite: (userId: string, favoriteId: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
  resetFavorites: () => void;
}