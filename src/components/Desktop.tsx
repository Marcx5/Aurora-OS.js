import { useState, useEffect, memo } from 'react';
import type { DesktopIcon } from '../App';
import { useAppContext } from './AppContext';
import { lightenColor } from '../utils/colors';

interface DesktopProps {
  onDoubleClick: () => void;
  icons: DesktopIcon[];
  onUpdateIconPosition: (id: string, position: { x: number; y: number }) => void;
  onIconDoubleClick: (iconId: string) => void;
}

function DesktopComponent({ onDoubleClick, icons, onUpdateIconPosition, onIconDoubleClick }: DesktopProps) {
  const { accentColor, reduceMotion, disableShadows } = useAppContext();
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingIcon) {
        const icon = icons.find(i => i.id === draggingIcon);
        if (icon) {
          onUpdateIconPosition(draggingIcon, {
            x: e.clientX - dragOffset.x,
            y: Math.max(40, e.clientY - dragOffset.y),
          });
        }
      }
    };

    const handleMouseUp = () => {
      setDraggingIcon(null);
    };

    if (draggingIcon) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingIcon, dragOffset, icons, onUpdateIconPosition]);

  const handleIconMouseDown = (e: React.MouseEvent, icon: DesktopIcon) => {
    e.stopPropagation();
    setDraggingIcon(icon.id);
    setSelectedIcon(icon.id);
    setDragOffset({
      x: e.clientX - icon.position.x,
      y: e.clientY - icon.position.y,
    });
  };

  const handleIconDoubleClick = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    onIconDoubleClick(iconId);
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null);
  };

  return (
    <div
      className="absolute inset-0 w-full h-full"
      onClick={handleDesktopClick}
      onDoubleClick={onDoubleClick}
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Desktop Icons */}
      {icons.map((icon) => (
        <div
          key={icon.id}
          className={`absolute flex flex-col items-center gap-1 p-3 rounded-lg cursor-pointer select-none 
            ${!reduceMotion ? 'transition-colors' : ''} 
            ${selectedIcon === icon.id ? 'bg-white/10 backdrop-blur-sm' : 'hover:bg-white/5'}`}
          style={{
            left: icon.position.x,
            top: icon.position.y,
            width: '100px',
          }}
          onMouseDown={(e) => handleIconMouseDown(e, icon)}
          onDoubleClick={(e) => handleIconDoubleClick(e, icon.id)}
        >
          <div className="relative w-16 h-16">
            {/* macOS-style folder icon */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
              className={!disableShadows ? 'drop-shadow-lg' : ''}>
              <path
                d="M8 14C8 11.7909 9.79086 10 12 10H24L28 16H52C54.2091 16 56 17.7909 56 20V50C56 52.2091 54.2091 54 52 54H12C9.79086 54 8 52.2091 8 50V14Z"
                fill={`url(#folder-gradient-${icon.id})`}
              />
              <defs>
                <linearGradient id={`folder-gradient-${icon.id}`} x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
                  <stop stopColor={lightenColor(accentColor, 20)} />
                  <stop offset="1" stopColor={accentColor} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={`text-xs text-white text-center px-2 py-1 bg-black/20 rounded backdrop-blur-sm 
            ${!disableShadows ? 'drop-shadow-lg' : ''}`}>
            {icon.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export const Desktop = memo(DesktopComponent);
