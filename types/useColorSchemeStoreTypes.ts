export interface ColorSchemeStorage {
  theme: 'light' | 'dark' | null;
  toggleTheme: (newTheme: 'light' | 'dark' | null) => void;
}