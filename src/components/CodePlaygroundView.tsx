import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Circle,
  Gauge,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import {
  ExecutionResult,
  GridCoord,
  LabConfig,
  SandboxSettings,
  TerminalLine,
} from '../types/sandbox';
import { CodeEditor } from './CodeEditor';
import { PathfindingGrid } from './PathfindingGrid';
import { TelemetryPanel } from './TelemetryPanel';
import { FormulaModal } from './FormulaModal';

interface CodePlaygroundViewProps {
  activeLab: LabConfig;
  allLabs: LabConfig[];
  code: string;
  isDirty: boolean;
  isRunning: boolean;
  isSimulating: boolean;
  result: ExecutionResult;
  currentStepIdx: number;
  terminalLines: TerminalLine[];
  settings: SandboxSettings;
  onChangeCode: (next: string) => void;
  onSelectLab: (labId: string) => void;
  onReset: () => void;
  onSave: () => void;
  onRun: () => void;
  onRestartSim: () => void;
  onStepForward: () => void;
  onToggleObstacle: (coord: GridCoord) => void;
}

export const CodePlaygroundView: React.FC<CodePlaygroundViewProps> = ({
  activeLab,
  allLabs,
  code,
  isDirty,
  isRunning,
  isSimulating,
  result,
  currentStepIdx,
  terminalLines,
  settings,
  onChangeCode,
  onSelectLab,
  onReset,
  onSave,
  onRun,
  onRestartSim,
  onStepForward,
  onToggleObstacle,
}) => {
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);

  // Determine objective states dynamically from execution result + step progress
  const activeStep =
    result.steps.length > 0
      ? result.steps[Math.min(currentStepIdx, result.steps.length - 1)]
      : null;

  const isAtFinalStep =
    result.success &&
    result.steps.length > 0 &&
    currentStepIdx >= result.steps.length - 1;

  const computedObjectives = activeLab.objectives.map((obj, idx) => {
    const isCompletedInRun = result.completedObjectiveIds.includes(obj.id);
    if (isAtFinalStep && isCompletedInRun) {
      return { ...obj, computedStatus: 'done' as const };
    }
    if (idx < 2 && isCompletedInRun) {
      return { ...obj, computedStatus: 'done' as const };
    }
    if (idx === 2) {
      return {
        ...obj,
        computedStatus: isAtFinalStep && isCompletedInRun ? ('done' as const) : ('active' as const),
      };
    }
    return {
      ...obj,
      computedStatus:
        isAtFinalStep && isCompletedInRun ? ('done' as const) : ('pending' as const),
    };
  });

  const doneCount = computedObjectives.filter((o) => o.computedStatus === 'done').length;

  const roverPos = activeStep ? activeStep.position : result.start;
  const roverHeading = activeStep ? activeStep.headingDeg : 90;

  return (
    <div className="p-5 md:p-8 bg-surface w-full max-w-[1440px] mx-auto">
      {/* Breadcrumb & Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-outline uppercase tracking-wider font-medium">
            {activeLab.moduleLabel}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-outline" />
          <span className="text-[13px] text-on-surface font-semibold">
            {activeLab.moduleTitle}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-outline" />
          <span className="text-[13px] text-primary font-medium">
            {activeLab.sessionId}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/40">
            <span
              className={`w-2 h-2 rounded-full ${
                settings.hardwareBridgeConnected
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-amber-500'
              }`}
            />
            <span className="font-mono text-[11px] text-on-surface-variant font-medium">
              Hardware Bridge:{' '}
              {settings.hardwareBridgeConnected ? 'Connected' : 'Local Sim'}
            </span>
          </div>
          <div className="font-mono text-[11px] text-outline tabular-nums">
            Latency: {settings.hardwareBridgeConnected ? '18ms' : '0ms'}
          </div>
        </div>
      </div>

      {/* 12-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. LEFT COLUMN: LESSON & EXPERIMENT GUIDE */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-lg p-6 border border-outline-variant/60 flex flex-col gap-4">
            {/* Card Header & Badge */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold tracking-wider">
                  {activeLab.labBadge}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[12px] font-semibold ${
                    activeLab.difficulty === 'Beginner'
                      ? 'bg-emerald-100 text-emerald-900'
                      : activeLab.difficulty === 'Intermediate'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-secondary-fixed text-on-secondary-fixed'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5" />
                  {activeLab.difficulty}
                </span>
              </div>
              <h1 className="text-[20px] leading-7 font-semibold text-on-surface tracking-tight">
                {activeLab.title}
              </h1>
              <p className="text-[12px] leading-4 text-on-surface-variant mt-1">
                {activeLab.subtitle}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/40">
              <h2 className="text-[16px] font-semibold text-on-surface flex items-center justify-between mb-3">
                <span>Objectives</span>
                <span className="font-mono text-[11px] text-on-surface-variant tabular-nums">
                  {doneCount} of {computedObjectives.length} done
                </span>
              </h2>
              <ul className="space-y-2.5 text-[12px]">
                {computedObjectives.map((obj) => (
                  <li key={obj.id} className="flex items-start gap-2.5">
                    {obj.computedStatus === 'done' && (
                      <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600 shrink-0" />
                    )}
                    {obj.computedStatus === 'active' && (
                      <Loader2 className="w-[18px] h-[18px] text-primary shrink-0 animate-spin" />
                    )}
                    {obj.computedStatus === 'pending' && (
                      <Circle className="w-[18px] h-[18px] text-outline shrink-0" />
                    )}
                    <span
                      className={
                        obj.computedStatus === 'done'
                          ? 'text-on-surface font-medium line-through opacity-70'
                          : obj.computedStatus === 'active'
                            ? 'text-on-surface font-semibold'
                            : 'text-on-surface-variant'
                      }
                    >
                      {obj.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2D Robotics Pathfinding Grid Widget */}
            <PathfindingGrid
              gridSize={result.gridSize}
              start={result.start}
              target={result.target}
              obstacles={result.obstacles}
              path={result.path}
              exploredNodes={result.exploredNodes}
              roverPos={roverPos}
              roverHeadingDeg={roverHeading}
              showExploredNodes={settings.showExploredNodes}
              onToggleObstacle={onToggleObstacle}
            />

            {/* Hint & Edge Case Callout Box */}
            <div className="bg-surface-container-low rounded-lg p-3.5 border border-outline-variant/40 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-on-surface">
                  <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400/30" />
                  <span className="font-semibold text-xs uppercase tracking-wide">
                    Hint &amp; Edge Case
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormulaModalOpen(true)}
                  className="text-[12px] text-primary-container font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View Formula Docs</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                Ensure{' '}
                <code className="font-mono text-[11px] bg-surface-container px-1 py-0.5 rounded text-primary">
                  {activeLab.hintCodeRefs[0]}
                </code>{' '}
                checks all 4 cardinal directions before invoking{' '}
                <code className="font-mono text-[11px] bg-surface-container px-1 py-0.5 rounded text-primary">
                  {activeLab.hintCodeRefs[1]}
                </code>{' '}
                to prevent dead-end traps.
              </p>
            </div>

            {/* Quick Reference STEM Metrics Card */}
            <div className="p-3.5 bg-surface-container rounded-lg border border-outline-variant/40 flex items-center justify-between text-on-surface gap-2">
              <div>
                <div className="font-mono text-[10px] text-outline uppercase leading-tight">
                  Euclidean Distance
                </div>
                <div className="text-[17px] leading-6 font-bold text-on-surface tabular-nums whitespace-nowrap mt-0.5">
                  {result.euclideanDistance.toFixed(2)}{' '}
                  <span className="text-[11px] font-normal text-on-surface-variant">
                    units
                  </span>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant" />
              <div>
                <div className="font-mono text-[10px] text-outline uppercase leading-tight">
                  A* Heuristic Weight
                </div>
                <div className="text-[17px] leading-6 font-bold text-secondary tabular-nums whitespace-nowrap mt-0.5">
                  h(n) = {result.heuristicWeight.toFixed(2)}
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant" />
              <div>
                <div className="font-mono text-[10px] text-outline uppercase leading-tight">
                  Min Clear Path
                </div>
                <div
                  className={`text-[17px] leading-6 font-bold whitespace-nowrap mt-0.5 ${
                    result.minClearPathLabel === 'Optimal'
                      ? 'text-emerald-700'
                      : result.minClearPathLabel === 'Suboptimal'
                        ? 'text-amber-700'
                        : 'text-error'
                  }`}
                >
                  {result.minClearPathLabel}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CENTER & RIGHT COLUMN: CODE EDITOR + LIVE TELEMETRY/LOG */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <CodeEditor
            code={code}
            activeLab={activeLab}
            allLabs={allLabs}
            isRunning={isRunning}
            isDirty={isDirty}
            fontSizePx={settings.editorFontSize}
            onChangeCode={onChangeCode}
            onSelectLab={onSelectLab}
            onReset={onReset}
            onSave={onSave}
            onRun={onRun}
          />

          <TelemetryPanel
            result={result}
            currentStepIdx={currentStepIdx}
            terminalLines={terminalLines}
            isSimulating={isSimulating}
            onRestartSim={onRestartSim}
            onStepForward={onStepForward}
          />
        </section>
      </div>

      <FormulaModal
        open={formulaModalOpen}
        heuristicWeight={result.heuristicWeight}
        euclideanDistance={result.euclideanDistance}
        onClose={() => setFormulaModalOpen(false)}
      />
    </div>
  );
};
