import { atom } from 'nanostores';

export type Theme = 'dark' | 'light';

export const kTheme = 'bolt_theme';

export function themeIsDark() {
  return themeStore.get() === 'dark';
}

export const DEFAULT_THEME = 'light';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME;
  }

  try {
    const persistedTheme = localStorage.getItem(kTheme) as Theme | undefined;
    if (persistedTheme && (persistedTheme === 'dark' || persistedTheme === 'light')) {
      return persistedTheme;
    }

    const themeAttribute = document.documentElement.getAttribute('data-theme') as Theme | null;
    if (themeAttribute && (themeAttribute === 'dark' || themeAttribute === 'light')) {
      return themeAttribute;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (e) {
    return DEFAULT_THEME;
  }
}

export const themeStore = atom<Theme>(getInitialTheme());

export function toggleTheme() {
  const currentTheme = themeStore.get();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  themeStore.set(newTheme);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(kTheme, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch (e) {
      console.warn('Failed to persist theme:', e);
    }
  }
}