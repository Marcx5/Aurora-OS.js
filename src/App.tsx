import { useState, useCallback, useMemo, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { FileManager } from './components/FileManager';
import { NotificationCenter } from './components/NotificationCenter';
import { Settings } from './components/Settings';
import { Photos } from './components/apps/Photos';
import { Music } from './components/apps/Music';
import { Messages } from './components/apps/Messages';
import { Browser } from './components/apps/Browser';
import { Terminal } from './components/apps/Terminal';
import { PlaceholderApp } from './components/apps/PlaceholderApp';
import { AppProvider } from './components/AppContext';
import { FileSystemProvider } from './components/FileSystemContext';
import { Toaster } from './components/ui/sonner';

export interface WindowState {
  id: string;
  title: string;
  content: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface DesktopIcon {
  id: string;
  name: string;
  type: 'folder' | 'file';
  position: { x: number; y: number };
}

const DESKTOP_ICONS_STORAGE_KEY = 'aurora-os-desktop-icons';

const defaultDesktopIcons: DesktopIcon[] = [
  { id: '1', name: 'Documents', type: 'folder', position: { x: 100, y: 80 } },
  { id: '2', name: 'Downloads', type: 'folder', position: { x: 100, y: 200 } },
  { id: '3', name: 'Pictures', type: 'folder', position: { x: 100, y: 320 } },
  { id: '4', name: 'Music', type: 'folder', position: { x: 100, y: 440 } },
];

function loadDesktopIcons(): DesktopIcon[] {
  try {
    const stored = localStorage.getItem(DESKTOP_ICONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load desktop icons:', e);
  }
  return defaultDesktopIcons;
}

function saveDesktopIcons(icons: DesktopIcon[]) {
  try {
    localStorage.setItem(DESKTOP_ICONS_STORAGE_KEY, JSON.stringify(icons));
  } catch (e) {
    console.warn('Failed to save desktop icons:', e);
  }
}

export default function App() {
  // Windows reset on refresh (not persisted)
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [topZIndex, setTopZIndex] = useState(100);

  // Desktop icons are persisted
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>(() => loadDesktopIcons());

  // Save desktop icons whenever they change
  useEffect(() => {
    saveDesktopIcons(desktopIcons);
  }, [desktopIcons]);

  const openWindow = useCallback((type: string) => {
    let content: React.ReactNode;
    let title: string;

    switch (type) {
      case 'finder':
        title = 'Finder';
        content = <FileManager />;
        break;
      case 'settings':
        title = 'System Settings';
        content = <Settings />;
        break;
      case 'photos':
        title = 'Photos';
        content = <Photos />;
        break;
      case 'music':
        title = 'Music';
        content = <Music />;
        break;
      case 'messages':
        title = 'Messages';
        content = <Messages />;
        break;
      case 'browser':
        title = 'Browser';
        content = <Browser />;
        break;
      case 'terminal':
        title = 'Terminal';
        content = <Terminal />;
        break;
      default:
        title = type.charAt(0).toUpperCase() + type.slice(1);
        content = <PlaceholderApp title={title} />;
    }

    setWindows(prevWindows => {
      const newZIndex = topZIndex + 1;
      const newWindow: WindowState = {
        id: `${type}-${Date.now()}`,
        title,
        content,
        isMinimized: false,
        isMaximized: false,
        position: { x: 100 + prevWindows.length * 30, y: 80 + prevWindows.length * 30 },
        size: { width: 900, height: 600 },
        zIndex: newZIndex,
      };
      setTopZIndex(newZIndex);
      return [...prevWindows, newWindow];
    });
  }, [topZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prevWindows => prevWindows.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prevWindows => {
      const updated = prevWindows.map(w =>
        w.id === id ? { ...w, isMinimized: true } : w
      );

      // Find the next visible window with highest zIndex to focus
      const visibleWindows = updated.filter(w => !w.isMinimized);
      if (visibleWindows.length > 0) {
        const topWindow = visibleWindows.reduce((max, w) =>
          w.zIndex > max.zIndex ? w : max, visibleWindows[0]
        );
        // Bump its zIndex to make it focused
        const newZIndex = topZIndex + 1;
        setTopZIndex(newZIndex);
        return updated.map(w =>
          w.id === topWindow.id ? { ...w, zIndex: newZIndex } : w
        );
      }

      return updated;
    });
  }, [topZIndex]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prevWindows => prevWindows.map(w =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setTopZIndex(prevZIndex => {
      const newZIndex = prevZIndex + 1;
      setWindows(prevWindows => prevWindows.map(w =>
        w.id === id ? { ...w, zIndex: newZIndex, isMinimized: false } : w
      ));
      return newZIndex;
    });
  }, []);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prevWindows => prevWindows.map(w =>
      w.id === id ? { ...w, position } : w
    ));
  }, []);



  const updateIconPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setDesktopIcons(prevIcons => prevIcons.map(icon =>
      icon.id === id ? { ...icon, position } : icon
    ));
  }, []);

  const toggleNotifications = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  const handleIconDoubleClick = useCallback(() => {
    openWindow('finder');
  }, [openWindow]);

  // Get the highest zIndex to determine focused window
  const focusedWindowId = useMemo(() => {
    if (windows.length === 0) return null;
    return windows.reduce((max, w) => w.zIndex > max.zIndex ? w : max, windows[0]).id;
  }, [windows]);

  // Extract app type from focused window ID (format: "apptype-timestamp")
  const focusedAppType = useMemo(() => {
    if (!focusedWindowId) return null;
    return focusedWindowId.split('-')[0];
  }, [focusedWindowId]);

  return (
    <AppProvider>
      <FileSystemProvider>
        <div className="dark h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
          <Desktop
            onDoubleClick={() => { }}
            icons={desktopIcons}
            onUpdateIconPosition={updateIconPosition}
            onIconDoubleClick={handleIconDoubleClick}
          />

          <MenuBar
            onNotificationsClick={toggleNotifications}
            focusedApp={focusedAppType}
          />

          <Dock
            onOpenApp={openWindow}
            onRestoreWindow={focusWindow}
            onFocusWindow={focusWindow}
            windows={windows}
          />

          {windows.map(window => (
            <Window
              key={window.id}
              window={window}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onUpdatePosition={(pos) => updateWindowPosition(window.id, pos)}
              isFocused={window.id === focusedWindowId}
            />
          ))}

          <NotificationCenter
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />

          <Toaster />
        </div>
      </FileSystemProvider>
    </AppProvider>
  );
}