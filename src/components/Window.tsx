import { Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState, useEffect, memo, useCallback } from 'react';
import type { WindowState } from '../App';

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
  onUpdateSize?: (size: { width: number; height: number }) => void;
  isFocused: boolean;
}

import { useThemeColors } from '../hooks/useThemeColors';
import { useAppContext } from './AppContext';

function WindowComponent({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  isFocused
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const { titleBarBackground } = useThemeColors();
  const { reduceMotion, disableShadows } = useAppContext();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    });
    onFocus();
  }, [window.position.x, window.position.y, onFocus]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        onUpdatePosition({
          x: e.clientX - dragOffset.x,
          y: Math.max(28, e.clientY - dragOffset.y),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.isMaximized, onUpdatePosition]);

  const position = window.isMaximized
    ? { x: 0, y: 28 }
    : window.position;

  const size = window.isMaximized
    ? { width: '100vw', height: 'calc(100vh - 28px)' }
    : { width: window.size.width, height: window.size.height };

  // Calculate animation toward dock on the LEFT side of screen
  // Dock is at left: 16px, width ~64px, so center is around 48px
  const dockCenterX = 48;
  const screenHeight = typeof globalThis !== 'undefined' ? globalThis.innerHeight || 900 : 900;
  const dockCenterY = screenHeight / 2; // Dock is vertically centered

  return (
    <motion.div
      ref={windowRef}
      className={`absolute rounded-xl overflow-hidden border border-white/20 
        ${!disableShadows ? 'shadow-2xl' : ''} 
        ${isDragging ? '' : ''} 
        ${!isFocused && !window.isMinimized ? 'brightness-75 saturate-50' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: window.zIndex,
        // If not focused, force opaque background to disable transparency
        background: !isFocused ? '#171717' : undefined,
        // Prevent interaction when minimized
        pointerEvents: window.isMinimized ? 'none' : 'auto',
        // Transform origin toward left center (dock area)
        transformOrigin: 'center left',
      }}
      initial={{
        scale: reduceMotion ? 1 : 0.95,
        opacity: reduceMotion ? 1 : 0,
        x: 0,
        y: 0,
      }}
      animate={{
        scale: window.isMinimized ? (reduceMotion ? 0 : 0.2) : 1,
        opacity: window.isMinimized ? 0 : 1,
        // Move toward dock center (left side)
        x: window.isMinimized ? (reduceMotion ? 0 : dockCenterX - position.x) : 0,
        y: window.isMinimized ? (reduceMotion ? 0 : dockCenterY - position.y - (window.size.height / 2)) : 0,
      }}
      exit={{
        scale: reduceMotion ? 1 : 0.95,
        opacity: reduceMotion ? 1 : 0
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.3,
        ease: [0.32, 0.72, 0, 1], // macOS-like ease
      }}
      onMouseDown={window.isMinimized ? undefined : onFocus}
    >

      {/* Title Bar */}
      <div
        className="h-11 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 cursor-move select-none"
        style={{ background: titleBarBackground }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 window-controls">
          <button
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            onClick={onClose}
          />
          <button
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            onClick={onMinimize}
          />
          <button
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            onClick={onMaximize}
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-sm text-white/80">
          {window.title}
        </div>

        <div className="window-controls opacity-0">
          <Maximize2 className="w-4 h-4" />
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-44px)] overflow-auto">
        {window.content}
      </div>
    </motion.div>
  );
}

export const Window = memo(WindowComponent);