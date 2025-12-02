import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Page Load Time:', navEntry.loadEventEnd - navEntry.fetchStart, 'ms');
        }
        
        if (entry.entryType === 'paint') {
          console.log(`${entry.name}:`, entry.startTime, 'ms');
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime, 'ms');
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return null;
};

export default PerformanceMonitor;