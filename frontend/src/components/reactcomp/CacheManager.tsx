// src/components/CacheManager.tsx
import { useEffect } from 'react';
import { checkAndClearCache } from '@/lib/cache-utils';

const CacheManager = () => {
  useEffect(() => {
    checkAndClearCache();
    const interval = setInterval(checkAndClearCache, 1000 * 60 * 10); // Every 10 minutes
    return () => clearInterval(interval);
  }, []);
  return null; // No UI component needed
};

export default CacheManager;
