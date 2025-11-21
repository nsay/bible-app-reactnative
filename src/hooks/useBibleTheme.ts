import { useMemo, useState } from 'react';
import { darkTheme, lightTheme, Theme } from '../theme/theme';

export function useBibleTheme(): {
  theme: Theme;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
} {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(() => (themeMode === 'dark' ? darkTheme : lightTheme), [themeMode]);

  return { theme, themeMode, toggleTheme };
}
