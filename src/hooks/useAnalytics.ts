import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname,
      });
    }
  }, [location]);

  const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackUserEngagement = (engagementTime: number) => {
    trackEvent({
      action: 'engagement_time',
      category: 'User Engagement',
      value: engagementTime,
    });
  };

  const trackFeatureUsage = (feature: string) => {
    trackEvent({
      action: 'feature_used',
      category: 'Feature Usage',
      label: feature,
    });
  };

  return {
    trackEvent,
    trackUserEngagement,
    trackFeatureUsage,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}