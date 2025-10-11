// src/lib/cache-utils.ts
import { getQueryClient } from '@/lib/tan-stack/tanstack-query';

export const checkAndClearCache = () => {
  const queryClient = getQueryClient();
  const CACHE_KEY = 'REACT_QUERY_OFFLINE_CACHE';

  try {
    const data = localStorage.getItem(CACHE_KEY);
    const sizeMB = data ? data.length / 1024 / 1024 : 0;

    if (sizeMB > 8) {
      // Example: Clear if >8MB
      queryClient.clear();
      localStorage.removeItem(CACHE_KEY);
      console.warn(`🧹 Cache cleared due to size limit (${sizeMB.toFixed(2)} MB)`);
    }
  } catch (error) {
    console.error('Error checking cache size:', error);
    queryClient.clear(); // Fallback clear
    localStorage.removeItem(CACHE_KEY);
  }
};
