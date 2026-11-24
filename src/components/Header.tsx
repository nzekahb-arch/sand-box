import React from 'react';
import { ChevronRight, Flame, Hexagon, Menu, X } from 'lucide-react';
import { NavTabId } from '../types/sandbox';

interface HeaderProps {
  activeTab: NavTabId;
  activeModuleTitle: string;
  xp: number;
  streakDays: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigate: (tab: NavTabId) => void;
}

const TAB_LABELS: Record<NavTabId, string> = {
  dashboard: 'Overview & Modules',
  'code-playground': 'Python & Robotics Lab',
  'robotics-lab': 'A* Heuristic Explorer',
  'physics-and-math': 'Kinematics & Ballistics',
  challenges: 'STEM Challenges',
  'my-projects': 'Saved Scripts',
  documentation: 'API & Formula Docs',
  settings: 'Workspace Settings',
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  activeModuleTitle,
  xp,
  streakDays,
  mobileMenuOpen,
  onToggleMobileMenu,
  onNavigate,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-surface-container-lowest border-b border-outline-variant">
      <div className="h-16 px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('code-playground')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-xs group-hover:bg-primary transition-colors">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" />
                <path d="M3 7l9 5 9-5" />
                <path d="M12 12v10" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[18px] md:text-[20px] leading-7 font-semibold text-on-surface tracking-tight">
              Code &amp; STEM Sandbox
            </span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[13px] font-medium text-on-surface-variant">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="hover:text-on-surface transition-colors cursor-pointer"
          >
            Modules
          </button>
          <ChevronRight className="w-4 h-4 text-outline" />
          <span className="text-on-surface font-semibold">
            {activeTab === 'code-playground'
              ? `Python & Robotics Lab`
              : TAB_LABELS[activeTab] || activeModuleTitle}
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div
            className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant"
            title="Total STEM Experience Points"
          >
            <Hexagon className="w-4 h-4 text-secondary fill-secondary/15" />
            <span className="font-mono text-[11px] font-bold text-on-surface tabular-nums">
              {xp.toLocaleString()} XP
            </span>
          </div>

          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-error-container/30 rounded-full border border-outline-variant"
            title="Active learning streak"
          >
            <Flame className="w-4 h-4 text-error fill-error/20" />
            <span className="font-mono text-[11px] font-bold text-on-surface tabular-nums">
              {streakDays} Days
            </span>
          </div>

          <div className="hidden sm:block h-7 w-px bg-outline-variant" />

          <button
            type="button"
            onClick={() => onNavigate('settings')}
            title="Learner Profile & Settings"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary text-white font-semibold text-xs flex items-center justify-center border border-outline-variant hover:opacity-90 transition-opacity cursor-pointer"
          >
            AR
          </button>
        </div>
      </div>
    </header>
  );
};
