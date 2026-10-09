// BAZAR360 Unified Enterprise Theme Provider
// Enforces single dark luxury system permanently across all pages and components.

import React, { createContext, useContext, useEffect } from 'react';

export type ThemeType = 'dark';
export type ThemeClassType = string;

interface ThemeContextType {
  theme: ThemeType;
  currentTheme: ThemeType;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  currentTheme: 'dark',
  isDark: true,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', currentTheme: 'dark', isDark: true, setTheme: () => {}, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
