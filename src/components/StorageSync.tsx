'use client';

import { useEffect } from 'react';

/**
 * Client-side storage synchronizer
 * This component runs only on client-side to sync localStorage with server
 */
export function StorageSync() {
  useEffect(() => {
    // Sync localStorage with server on app load
    const syncStorage = async () => {
      try {
        const stored = localStorage.getItem('gallery_items');
        if (stored) {
          const userItems = JSON.parse(stored);
          console.log(`Found ${userItems.length} user items in localStorage`);
          
          // Optionally ping server to ensure it's aware of client state
          const debugResponse = await fetch('/api/debug');
          const debugData = await debugResponse.json();
          console.log('Server storage state:', debugData.data);
        }
      } catch (error) {
        console.warn('Storage sync failed:', error);
      }
    };

    syncStorage();
  }, []);

  return null; // This component doesn't render anything
}