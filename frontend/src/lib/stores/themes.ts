import { persistentMap } from '@nanostores/persistent';
export type SettingsValue = {
  theme?: 'dark' | 'light'; // optional instead of null
};

export const nanoTheme = persistentMap<SettingsValue>('settings:', {
  theme: undefined,
});
