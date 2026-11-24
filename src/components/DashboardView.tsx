import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Flame,
  Hexagon,
  Sigma,
  Terminal,
  Trophy,
} from 'lucide-react';
import { LabConfig, NavTabId } from '../types/sandbox';

interface DashboardViewProps {
  labs: LabConfig[];
  completedLabIds: string[];
  xp: number;
  streakDays: number;
  savedCount: number;
  onOpenLab: (labId: string) => void;
  onNavigate: (tab: NavTabId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  labs,
  completedLabIds,
  xp,
  streakDays,
  savedCount,
  onOpenLab,
  onNavigate,
}) => {
  return (
    <div className="p-5 md:p-8 bg-surface w-full max-w-[1440px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
            STEM Workspace Overview
          </span>
          <h1 className="text-[24px] leading-8 font-semibold text-on-surface tracking-tight mt-0.5">
            Welcome back to Code &amp; STEM Sandbox
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            Continue autonomous kinematics labs, tune A* heuristics, or explore physics simulations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('code-playground')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <Terminal className="w-4 h-4" />
          <span>Resume Lab 04</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-mono text-outline uppercase">
            <span>Total XP Earned</span>
            <Hexagon className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-bold text-on-surface mt-2 tabular-nums">
            {xp.toLocaleString()} XP
          </div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">
            +150 XP available in Lab 04
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-mono text-outline uppercase">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-error" />
          </div>
          <div className="text-2xl font-bold text-on-surface mt-2 tabular-nums">
            {streakDays} Days
          </div>
          <div className="text-xs text-on-surface-variant mt-1">
            Daily robotics simulation goal met
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-mono text-outline uppercase">
            <span>Labs Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-on-surface mt-2 tabular-nums">
            {completedLabIds.length} / {labs.length}
          </div>
          <div className="text-xs text-on-surface-variant mt-1">
            Module 02: Autonomous Kinematics
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-mono text-outline uppercase">
            <span>Saved Scripts</span>
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-on-surface mt-2 tabular-nums">
            {savedCount}
          </div>
          <button
            type="button"
            onClick={() => onNavigate('my-projects')}
            className="text-xs text-primary font-semibold hover:underline mt-1 cursor-pointer"
          >
            View My Projects →
          </button>
        </div>
      </div>

      {/* Curriculum Labs */}
      <div>
        <h2 className="text-[16px] font-semibold text-on-surface mb-3">
          Python &amp; Robotics Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {labs.map((lab) => {
            const done = completedLabIds.includes(lab.id);
            return (
              <div
                key={lab.id}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5 flex flex-col justify-between gap-4 hover:border-primary-container transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                      {lab.labBadge}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                        done
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      {done ? 'COMPLETED' : `+${lab.xpReward} XP`}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-on-surface">{lab.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {lab.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                  <span className="font-mono text-[11px] text-outline">{lab.fileName}</span>
                  <button
                    type="button"
                    onClick={() => onOpenLab(lab.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <span>Open Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Sandboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-primary-fixed text-primary">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-on-surface">
                Robotics Lab: A* vs Dijkstra vs BFS
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Benchmark search node expansions on an interactive 8×8 hazard matrix.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('robotics-lab')}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-xs font-semibold text-on-surface cursor-pointer"
          >
            Launch
          </button>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-secondary-fixed text-secondary">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-on-surface">
                Physics &amp; Math: Kinematics &amp; Ballistics
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Simulate projectile vectors, parabolic arcs, and gravitational acceleration.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('physics-and-math')}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-xs font-semibold text-on-surface cursor-pointer"
          >
            Launch
          </button>
        </div>
      </div>
    </div>
  );
};
