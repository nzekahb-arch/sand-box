import React from 'react';
import {
  BookOpen,
  Cpu,
  FolderCode,
  LayoutGrid,
  Settings,
  Sigma,
  Terminal,
  Trophy,
} from 'lucide-react';
import { NavTabId } from '../types/sandbox';

interface SidebarProps {
  activeTab: NavTabId;
  savedCount: number;
  mobileOpen: boolean;
  onSelectTab: (tab: NavTabId) => void;
  onCloseMobile: () => void;
}

const PRIMARY_NAV: { id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'code-playground', label: 'Code Playground', icon: Terminal },
  { id: 'robotics-lab', label: 'Robotics Lab', icon: Cpu },
  { id: 'physics-and-math', label: 'Physics & Math', icon: Sigma },
  { id: 'challenges', label: 'Challenges', icon: Trophy },
  { id: 'my-projects', label: 'My Projects', icon: FolderCode },
];

const SECONDARY_NAV: { id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'documentation', label: 'Docs & API', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  savedCount,
  mobileOpen,
  onSelectTab,
  onCloseMobile,
}) => {
  const handleSelect = (tab: NavTabId) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const renderItem = (item: {
    id: NavTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        type="button"
        aria-current={isActive ? 'page' : undefined}
        onClick={() => handleSelect(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-1 ${
          isActive
            ? 'bg-primary-container text-on-primary font-semibold'
            : 'font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon className="w-[18px] h-[18px] shrink-0" />
          <span>{item.label}</span>
        </span>
        {item.id === 'my-projects' && savedCount > 0 && (
          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 rounded tabular-nums ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            {savedCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/30 z-30 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-60 bg-surface-container-low border-r border-outline-variant z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
          {PRIMARY_NAV.map(renderItem)}
        </nav>

        <div className="pt-4 border-t border-outline-variant flex flex-col gap-1.5">
          {SECONDARY_NAV.map(renderItem)}
        </div>
      </aside>
    </>
  );
};
