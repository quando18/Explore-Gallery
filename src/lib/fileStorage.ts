import { GalleryItem } from '@/types';
import { mockItems } from '@/lib/mockData';

// File-based storage for Vercel
const STORAGE_KEY = 'gallery_items';

// Initialize with mock data if empty
let cachedItems: GalleryItem[] | null = null;

// For server-side, use environment variable to store data
// For client-side, use localStorage
function getStorageItems(): GalleryItem[] {
  if (cachedItems) {
    return cachedItems;
  }

  try {
    // Server-side: use JSON file simulation with environment
    if (typeof window === 'undefined') {
      // On server, always return mockItems + any from process.env
      const envItems = process.env.GALLERY_ITEMS ? JSON.parse(process.env.GALLERY_ITEMS) : [];
      cachedItems = [...mockItems, ...envItems];
      return cachedItems;
    } else {
      // Client-side: use localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored);
        cachedItems = [...mockItems, ...parsedItems];
        return cachedItems;
      }
      cachedItems = [...mockItems];
      return cachedItems;
    }
  } catch (error) {
    console.error('Error loading storage items:', error);
    cachedItems = [...mockItems];
    return cachedItems;
  }
}

function saveStorageItems(items: GalleryItem[]): void {
  try {
    // Extract only new items (not mock items)
    const newItems = items.filter(item => 
      !mockItems.some(mockItem => mockItem.id === item.id)
    );

    if (typeof window === 'undefined') {
      // Server-side: we can't persist, but cache in memory for this request
      cachedItems = items;
    } else {
      // Client-side: save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      cachedItems = items;
    }
  } catch (error) {
    console.error('Error saving storage items:', error);
  }
}

export function getAllItemsFile(): GalleryItem[] {
  return getStorageItems();
}

export function getItemByIdFile(id: string): GalleryItem | undefined {
  const items = getStorageItems();
  return items.find(item => item.id === id);
}

export function addItemFile(item: GalleryItem): void {
  const items = getStorageItems();
  const newItems = [item, ...items];
  saveStorageItems(newItems);
  cachedItems = newItems;
}

export function incrementViewsFile(id: string): void {
  const items = getStorageItems();
  const item = items.find(item => item.id === id);
  if (item) {
    item.views += 1;
    saveStorageItems(items);
  }
}

// Sync function for client-server
export function syncItemsWithServer(): Promise<GalleryItem[]> {
  return new Promise((resolve) => {
    // In a real app, this would fetch from server
    // For now, just return current items
    resolve(getStorageItems());
  });
}