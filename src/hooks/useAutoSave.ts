import { useEffect, useCallback, useRef } from 'react';

interface UseAutoSaveOptions {
  key: string;
  data: any;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ key, data, delay = 1000, enabled = true }: UseAutoSaveOptions) => {
  const timeoutRef = useRef<number>();

  const saveToStorage = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }, delay);
  }, [key, data, delay]);

  useEffect(() => {
    if (enabled && data) {
      saveToStorage();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveToStorage, enabled]);

  const clearAutoSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, [key]);

  const loadAutoSave = useCallback(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  }, [key]);

  return {
    clearAutoSave,
    loadAutoSave,
  };
};
