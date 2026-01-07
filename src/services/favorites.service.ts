import { Destination } from '@/models';

const FAVORITES_KEY = 'favorite_destinations';

export const favoritesService = {
  // Get all favorite destinations
  getFavorites(): Destination[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },

  // Add destination to favorites
  addFavorite(destination: Destination): void {
    try {
      const favorites = this.getFavorites();
      const exists = favorites.some(fav => fav.id === destination.id);
      
      if (!exists) {
        favorites.push(destination);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  // Remove destination from favorites
  removeFavorite(destinationId: string): void {
    try {
      const favorites = this.getFavorites();
      const filtered = favorites.filter(fav => fav.id !== destinationId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  // Check if destination is favorited
  isFavorite(destinationId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === destinationId);
  },

  // Toggle favorite status
  toggleFavorite(destination: Destination): boolean {
    const isFav = this.isFavorite(destination.id);
    
    if (isFav) {
      this.removeFavorite(destination.id);
      return false;
    } else {
      this.addFavorite(destination);
      return true;
    }
  }
};
