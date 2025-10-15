import { GalleryItem } from '@/types';
import { mockItems } from '@/lib/mockData';

// Global storage that persists across requests in serverless
const STORAGE_KEY = 'gallery_items';

class PersistentStorage {
  private static instance: PersistentStorage;
  private items: GalleryItem[] = [];
  private initialized = false;

  private constructor() {}

  static getInstance(): PersistentStorage {
    if (!PersistentStorage.instance) {
      PersistentStorage.instance = new PersistentStorage();
    }
    return PersistentStorage.instance;
  }

  private init() {
    if (!this.initialized) {
      // Load from mock data initially
      this.items = [...mockItems];
      this.initialized = true;
      
      // Try to load from localStorage if in browser (for client-side persistence)
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsedItems = JSON.parse(stored);
            // Merge with existing items, avoiding duplicates
            const existingIds = new Set(this.items.map(item => item.id));
            const newItems = parsedItems.filter((item: GalleryItem) => !existingIds.has(item.id));
            this.items = [...newItems, ...this.items];
          }
        } catch (error) {
          console.warn('Failed to load from localStorage:', error);
        }
      }
    }
  }

  private saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      try {
        // Only save user-added items (not mock items)
        const userItems = this.items.filter(item => 
          !mockItems.some(mockItem => mockItem.id === item.id)
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userItems));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
  }

  getAllItems(): GalleryItem[] {
    this.init();
    return [...this.items];
  }

  getItemById(id: string): GalleryItem | undefined {
    this.init();
    return this.items.find(item => item.id === id);
  }

  addItem(item: GalleryItem): GalleryItem {
    this.init();
    
    // Add to beginning of array (newest first)
    this.items.unshift(item);
    
    // Save to localStorage for persistence
    this.saveToLocalStorage();
    
    return item;
  }

  incrementViews(id: string): boolean {
    this.init();
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.views += 1;
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // For debugging
  getStorageInfo() {
    this.init();
    return {
      totalItems: this.items.length,
      mockItems: mockItems.length,
      userItems: this.items.length - mockItems.length,
      initialized: this.initialized
    };
  }
}

// Export singleton instance
const storage = PersistentStorage.getInstance();

export function getAllItems(): GalleryItem[] {
  return storage.getAllItems();
}

export function getItemById(id: string): GalleryItem | undefined {
  return storage.getItemById(id);
}

export function addItem(item: GalleryItem): GalleryItem {
  return storage.addItem(item);
}

export function incrementViews(id: string): boolean {
  return storage.incrementViews(id);
}

export function getStorageInfo() {
  return storage.getStorageInfo();
}