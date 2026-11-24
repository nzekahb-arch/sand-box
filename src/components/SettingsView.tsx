import React from 'react';
import { RotateCcw, Settings } from 'lucide-react';
import { SandboxSettings } from '../types/sandbox';

interface SettingsViewProps {
  settings: SandboxSettings;
  onUpdateSettings: (next: Partial<SandboxSettings>) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
}) => {
  return (
    <div className="p-5 md:p-8 bg-surface w-full max-w-[1000px] mx-auto space-y-6">
      <div>
        <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
          Environment Configuration
        </span>
        <h1 className="text-[24px] leading-8 font-semibold text-on-surface tracking-tight mt-0.5">
          Workspace Settings
        </h1>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-surface-container">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-on-surface">
            Editor &amp; Simulation Preferences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Editor Font Size ({settings.editorFontSize}px)
            </label>
            <input
              type="range"
              min={12}
              max={16}
              step={1}
              value={settings.editorFontSize}
              onChange={(e) =>
                onUpdateSettings({ editorFontSize: Number(e.target.value) })
              }
              className="w-full accent-primary-container cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Default A* Heuristic Weight ({settings.defaultHeuristicWeight.toFixed(2)})
            </label>
            <input
              type="range"
              min={1.0}
              max={2.0}
              step={0.05}
              value={settings.defaultHeuristicWeight}
              onChange={(e) =>
                onUpdateSettings({ defaultHeuristicWeight: Number(e.target.value) })
              }
              className="w-full accent-secondary cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-on-surface">
                Hardware Bridge Telemetry Sync
              </div>
              <div className="text-xs text-on-surface-variant">
                Simulate low-latency 18ms virtual hardware bridge connection
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.hardwareBridgeConnected}
              onChange={(e) =>
                onUpdateSettings({ hardwareBridgeConnected: e.target.checked })
              }
              className="w-4 h-4 accent-primary-container cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-on-surface">
                Highlight A* Explored Search Frontier
              </div>
              <div className="text-xs text-on-surface-variant">
                Tint visited open/closed grid cells in the 2D Robotics Pathfinding Grid
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.showExploredNodes}
              onChange={(e) =>
                onUpdateSettings({ showExploredNodes: e.target.checked })
              }
              className="w-4 h-4 accent-primary-container cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-surface-container flex items-center justify-between">
          <div className="text-xs text-on-surface-variant">
            Clear saved scripts, XP gains, and reset all lab code back to defaults.
          </div>
          <button
            type="button"
            onClick={onResetAllData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-error/40 text-error hover:bg-error-container/30 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Workspace Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
