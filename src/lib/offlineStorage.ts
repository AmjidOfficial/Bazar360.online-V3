import { CarListing } from '../types';

const RECENT_VIEWS_KEY = 'bazar360_recent_views';
const MAX_RECENT_VIEWS = 30;

export function getRecentViewsOffline(): CarListing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_VIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[OfflineStorage] Error reading recent views:', err);
    return [];
  }
}

export function saveRecentViewOffline(car: CarListing): CarListing[] {
  if (typeof window === 'undefined' || !car || !car.id) return [];
  try {
    const current = getRecentViewsOffline();
    // Filter out duplicate
    const filtered = current.filter(item => item.id !== car.id);
    // Add to beginning
    const updated = [car, ...filtered].slice(0, MAX_RECENT_VIEWS);
    localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('[OfflineStorage] Error saving recent view:', err);
    return [];
  }
}

export function clearRecentViewsOffline(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_VIEWS_KEY);
  } catch (err) {
    console.warn('[OfflineStorage] Error clearing recent views:', err);
  }
}
