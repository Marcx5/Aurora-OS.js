import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ThemeMode = 'neutral' | 'shades' | 'contrast';

interface AppContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  blurEnabled: boolean;
  setBlurEnabled: (enabled: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
  disableShadows: boolean;
  setDisableShadows: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColor] = useState('#3b82f6'); // Default blue
  const [themeMode, setThemeMode] = useState<ThemeMode>('neutral'); // Default neutral
  const [blurEnabled, setBlurEnabled] = useState(true); // Default blur enabled
  const [reduceMotion, setReduceMotion] = useState(false);
  const [disableShadows, setDisableShadows] = useState(false);

  // Sync accent color to CSS variable for global theming
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-user', accentColor);
  }, [accentColor]);

  // Sync blur state to CSS variable for opacity calculations
  useEffect(() => {
    document.documentElement.style.setProperty('--blur-enabled', blurEnabled ? '1' : '0');
  }, [blurEnabled]);

  return (
    <AppContext.Provider value={{
      accentColor,
      setAccentColor,
      themeMode,
      setThemeMode,
      blurEnabled,
      setBlurEnabled,
      reduceMotion,
      setReduceMotion,
      disableShadows,
      setDisableShadows
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
