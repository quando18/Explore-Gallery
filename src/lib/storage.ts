import { GalleryItem } from '@/types';
import { mockItems } from '@/lib/mockData';

// In-memory storage for items (in real app, this would be a database)
let items: GalleryItem[] = [...mockItems];

export function getAllItems(): GalleryItem[] {
  return items;
}

export function getItemById(id: string): GalleryItem | undefined {
  console.log('Looking for item with ID:', id);
  console.log('Available IDs:', items.map(item => item.id));
  const found = items.find(item => item.id === id);
  console.log('Found item:', !!found);
  return found;
}

export function addItem(item: GalleryItem): void {
  console.log('Adding item with ID:', item.id);
  items.unshift(item); // Add to beginning of array
  console.log('Total items after add:', items.length);
}

export function updateItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  items[index] = { ...items[index], ...updates };
  return items[index];
}

export function incrementViews(id: string): GalleryItem | null {
  return updateItem(id, { views: (getItemById(id)?.views || 0) + 1 });
}