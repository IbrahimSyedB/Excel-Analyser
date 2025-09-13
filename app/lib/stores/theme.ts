import { atom } from 'nanostores';

export type Theme = 'dark' | 'light';

export const kTheme = 'bolt_theme';

export function themeIsDark() {
  return themeStore.get() === 'dark';
}

export const DEFAULT_THEME = 'light';

let initialTheme = DEFAULT_THEME;

// Only access localStorage on client side
if (typeof window !== 'undefined') {
  const persistedTheme = localStorage.getItem(kTheme) as Theme | undefined;
  const themeAttribute = document.querySelector('html')?.getAttribute('data-theme');
  initialTheme = persistedTheme ?? (themeAttribute as Theme) ?? DEFAULT_THEME;
}

export const themeStore = atom<Theme>(initialTheme);

export function toggleTheme() {
  const currentTheme = themeStore.get();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  themeStore.set(newTheme);

  if (typeof window !== 'undefined') {
    localStorage.setItem(kTheme, newTheme);
    document.querySelector('html')?.setAttribute('data-theme', newTheme);
  }
}