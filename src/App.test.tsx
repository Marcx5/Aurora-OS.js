import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App';

// Mock localStorage for persistence tests
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: vi.fn((key: string) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Aurora OS Integration', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it('boots and renders the Desktop environment', () => {
        render(<App />);

        // Verify that the desktop icons are loaded
        // "Documents" is one of the default icons in App.tsx
        const documentsIcon = screen.getByText('Documents');
        expect(documentsIcon).toBeInTheDocument();
    });

    it('renders the dock with app icons', () => {
        render(<App />);

        // Dock should contain app labels (shown on hover, but buttons exist)
        // The dock includes Finder, Mail, Photos, Music, etc.
        const finderButton = screen.getByRole('button', { name: /finder/i });
        expect(finderButton).toBeInTheDocument();
    });
});

describe('Persistence', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it('loads settings from localStorage on boot', () => {
        // Pre-populate localStorage with saved settings
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'aurora-os-settings') {
                return JSON.stringify({
                    accentColor: '#ff0000',
                    themeMode: 'contrast',
                    blurEnabled: false,
                    reduceMotion: true,
                    disableShadows: true,
                });
            }
            return null;
        });

        render(<App />);

        // Settings should have been loaded
        expect(localStorageMock.getItem).toHaveBeenCalledWith('aurora-os-settings');
    });

    it('loads desktop icons from localStorage on boot', () => {
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'aurora-os-desktop-icons') {
                return JSON.stringify([
                    { id: '1', name: 'Custom Folder', type: 'folder', position: { x: 200, y: 200 } },
                ]);
            }
            return null;
        });

        render(<App />);

        expect(localStorageMock.getItem).toHaveBeenCalledWith('aurora-os-desktop-icons');
    });

    it('loads filesystem from localStorage on boot', () => {
        render(<App />);

        // FileSystemContext uses 'aurora-filesystem' as the key
        expect(localStorageMock.getItem).toHaveBeenCalledWith('aurora-filesystem');
    });
});

describe('App Storage Hook', () => {
    it('persists app state to localStorage', () => {
        render(<App />);

        // Apps using useAppStorage should trigger localStorage writes
        // This is a smoke test to ensure the hook integrates correctly
        expect(localStorageMock.setItem).toHaveBeenCalled();
    });
});
