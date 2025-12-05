import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { cn } from '../ui/utils';

interface AppTemplateProps {
  sidebar?: {
    sections: {
      title: string;
      items: {
        id: string;
        label: string;
        icon: LucideIcon;
        badge?: string;
        action?: () => void;
      }[];
    }[];
  };
  toolbar?: ReactNode;
  content: ReactNode;
  hasSidebar?: boolean;
  className?: string;
  contentClassName?: string;
  toolbarClassName?: string;
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export function AppTemplate({
  sidebar,
  toolbar,
  content,
  hasSidebar = true,
  className,
  contentClassName,
  toolbarClassName,
  activeItem,
  onItemClick
}: AppTemplateProps) {
  const { accentColor } = useAppContext();
  const { windowBackground, sidebarBackground, titleBarBackground, blurStyle } = useThemeColors();

  return (
    <div
      className={cn("flex flex-col h-full", className)}
      style={{ background: windowBackground, ...blurStyle }}
    >
      {/* Toolbar */}
      {toolbar && (
        <div
          className={cn("h-12 border-b border-white/10 flex items-center px-4", toolbarClassName)}
          style={{ background: titleBarBackground, ...blurStyle }}
        >
          {toolbar}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {hasSidebar && sidebar && (
          <div
            className="w-56 border-r border-white/10 py-3 px-2 overflow-y-auto"
            style={{ background: sidebarBackground, ...blurStyle }}
          >
            {sidebar.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-4' : ''}>
                {section.title && (
                  <div className="px-3 py-1 text-xs text-white/40 mb-1">{section.title}</div>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => item.action ? item.action() : onItemClick?.(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-1.5 text-sm rounded-md transition-colors group",
                        activeItem === item.id
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5"
                      )}
                      style={{
                        '--accent-color': accentColor,
                      } as React.CSSProperties}
                    >
                      <item.icon className={cn(
                        "w-4 h-4 flex-shrink-0",
                        activeItem === item.id ? "text-white" : "text-white/50 group-hover:text-white/70"
                      )} />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs text-white/40">{item.badge}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className={cn("flex-1 overflow-y-auto", contentClassName)}>
          {content}
        </div>
      </div>
    </div>
  );
}
