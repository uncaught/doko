import {useCallback, useState} from 'react';
import {getSetting, setSetting} from './LocalStorage';

export function initDarkMode(): void {
  if (getSetting('darkMode', false)) {
    document.querySelector('html')?.classList.add('darkMode');
  }
}

export function useToggleDarkMode(): {
  isDark: boolean;
  toggle: () => void;
} {
  const [isDark, setIsDark] = useState(getSetting('darkMode', false));
  return {
    isDark,
    toggle: useCallback(() => {
      const toggledIsDark = !isDark;
      setIsDark(toggledIsDark);
      setSetting('darkMode', toggledIsDark);
      document.querySelector('html')?.classList.toggle('darkMode', toggledIsDark);
    }, [isDark]),
  };
}