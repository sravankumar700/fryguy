import React from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { ThemeMode } from '../../types';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const options: { id: ThemeMode; label: string; icon: string }[] = [
    { id: 'fiery', label: 'Fiery FRYGUY', icon: '🔥' },
    { id: 'charcoal', label: 'Premium Charcoal', icon: '◼' },
    { id: 'orange', label: 'Urban Orange', icon: '🍊' },
  ];

  return (
    <div
      id="theme-switcher-container"
      className="inline-flex items-center p-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 backdrop-blur-sm shadow-inner"
    >
      {options.map((opt) => {
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            id={`theme-btn-${opt.id}`}
            onClick={() => setTheme(opt.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm scale-105'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)] opacity-75 hover:opacity-100'
            }`}
            title={THEMES[opt.id].tagline}
          >
            <span>{opt.icon}</span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
