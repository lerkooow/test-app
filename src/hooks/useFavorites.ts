
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'favoriteMatches';

// Избранные матчи сохраняются в localStorage.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggle = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((favoriteId) => favoriteId !== id)
        : [...prev, id],
    );
  };

  return { favorites, isFavorite, toggle };
}
