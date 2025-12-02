import { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    // Check for user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    setReducedMotion(prefersReducedMotion);
    setHighContrast(prefersHighContrast);

    // Load saved preferences
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion');
    const savedFontSize = localStorage.getItem('accessibility-font-size') as 'small' | 'medium' | 'large';

    if (savedHighContrast) setHighContrast(JSON.parse(savedHighContrast));
    if (savedReducedMotion) setReducedMotion(JSON.parse(savedReducedMotion));
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    // Apply accessibility settings to document
    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    document.documentElement.setAttribute('data-font-size', fontSize);

    // Save preferences
    localStorage.setItem('accessibility-high-contrast', JSON.stringify(highContrast));
    localStorage.setItem('accessibility-reduced-motion', JSON.stringify(reducedMotion));
    localStorage.setItem('accessibility-font-size', fontSize);
  }, [highContrast, reducedMotion, fontSize]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        reducedMotion,
        fontSize,
        toggleHighContrast,
        toggleReducedMotion,
        setFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};