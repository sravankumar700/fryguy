import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface ThemeDetails {
  id: ThemeMode;
  name: string;
  tagline: string;
  primary: string;
  secondary: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  headingFont: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
}

export const THEMES: Record<ThemeMode, ThemeDetails> = {
  fiery: {
    id: 'fiery',
    name: 'Fiery FRYGUY',
    tagline: 'Bold crimson & deep slate contrast',
    primary: '#DC2626',
    secondary: '#0F172A',
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    headingFont: 'Poppins',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    icon: '🔥',
  },
  charcoal: {
    id: 'charcoal',
    name: 'Premium Charcoal',
    tagline: 'Minimal, sophisticated dark & red contrast',
    primary: '#0F172A',
    secondary: '#DC2626',
    bg: '#F1F5F9',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    headingFont: 'Sora',
    badgeBg: '#F1F5F9',
    badgeText: '#0F172A',
    icon: '◼',
  },
  orange: {
    id: 'orange',
    name: 'Urban Orange',
    tagline: 'Warm amber & deep slate contrast',
    primary: '#EA580C',
    secondary: '#1E293B',
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    headingFont: 'Manrope',
    badgeBg: '#FFEDD5',
    badgeText: '#9A3412',
    icon: '🍊',
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  themeDetails: ThemeDetails;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('fiery');

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('fryguy_demo_theme', newTheme);
  };

  useEffect(() => {
    const saved = localStorage.getItem('fryguy_demo_theme') as ThemeMode;
    if (saved && THEMES[saved]) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'fiery');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeDetails: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
