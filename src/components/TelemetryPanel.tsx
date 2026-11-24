import React, { useEffect, useRef } from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  Gauge,
  Navigation,
  Radar,
  Redo2,
  RotateCcw,
  Radio,
  Terminal,
} from 'lucide-react';
import { ExecutionResult, SimulationStep, TerminalLine } from '../types/sandbox';

interface TelemetryPanelProps {
  result: ExecutionResult;
  currentStepIdx: number;
  terminalLines: TerminalLine[];
  isSimulating: boolean;
  onRestartSim: () => void;
  onStepForward: () => void;
}

const TONE_CLASS: Record<TerminalLine['tone'], string> = {
  muted: 'text-slate-400',
  cyan: 'text-cyan-300',
  slate: 'text-slate-200',
  indigo: 'text-indigo-300',
  emerald: 'text-emerald-400 font-semibold',
  yellow: 'text-yellow-300',
  error: 'text-rose-400 font-medium',
};

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  result,
  currentStepIdx,
  terminalLines,
  isSimulating,
  onRestartSim,
  onStepForward,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [terminalLines]);

  const totalSteps = result.steps.length;
  const activeStep: SimulationStep =
    totalSteps > 0
      ? result.steps[Math.min(currentStepIdx, totalSteps - 1)]
      : {
          stepIndex: 0,
          position: result.start,
          headingDeg: 90,
          battery: 98.5,
          velocityMs: 0,
          lidarClearanceM: 2.1,
          nearestObstacleDistM: 1.84,
          avoidedObstacle: null,
          statusLabel: result.success ? 'Ready' : 'Halted on Error',
        };

  // Sample up to 4 milestone waypoints for clean HUD track (`A`, `1`, `2`, `B`)
  const path = result.path.length > 0 ? result.path : [result.start, result.target];
  const waypointSamples = buildWaypointSamples(path, result.start, result.target);
  const progressRatio =
    totalSteps > 1 ? Math.min(1, currentStepIdx / (totalSteps - 1)) : 1;

  const totalMoves = Math.max(0, path.length - 1);

  return (
    <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/60 flex flex-col gap-4">
      {/* Card Header & Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-primary" />
          <h2 className="text-[16px] font-semibold text-on-surface">
            Telemetry &amp; Simulation Output
          </h2>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
            result.success
              ? 'bg-emerald-100 text-emerald-900'
              : 'bg-error-container text-on-error-container'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              result.success
                ? isSimulating
                  ? 'bg-emerald-600 animate-ping'
                  : 'bg-emerald-600'
                : 'bg-error'
            }`}
          />
          {result.success ? 'LIVE SIMULATION' : 'EXECUTION FAULT'}
        </span>
      </div>

      {/* Split Content Grid: Left Canvas + Right Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Visual Simulation Dynamic Canvas */}
        <div className="min-h-[248px] bg-surface-container-low rounded-lg p-3.5 border border-outline-variant/40 relative flex flex-col justify-between">
          {/* Top HUD indicator */}
          <div className="flex items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-1.5 text-on-surface text-xs font-semibold uppercase tracking-wider">
              <Navigation className="w-4 h-4 text-primary" />
              <span>Kinematics &amp; Spatial Pos</span>
            </div>
            <div className="font-mono text-[11px] bg-surface-container-lowest px-2 py-0.5 rounded font-bold text-on-surface border border-outline-variant/50 tabular-nums">
              X: {activeStep.position.x.toFixed(1)} | Y: {activeStep.position.y.toFixed(1)} | θ:{' '}
              {activeStep.headingDeg}°
            </div>
          </div>

          {/* Telemetry HUD & Visual Rover Representation */}
          <div className="relative my-1.5 min-h-[124px] bg-surface-container-lowest rounded-md p-3 border border-outline-variant/40 flex flex-col justify-between overflow-hidden">
            {/* Background Radar Dots */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg width="100%" height="100%" aria-hidden="true">
                <defs>
                  <pattern
                    id="radar-dots"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="10" cy="10" r="1" fill="#1D4ED8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#radar-dots)" />
              </svg>
            </div>

            {/* Live Metrics Readout Bar */}
            <div className="relative z-10 flex items-center justify-between text-on-surface font-mono text-[11px] tabular-nums">
              <div className="flex items-center gap-1">
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-emerald-700">{activeStep.battery}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="w-4 h-4 text-primary" />
                <span className="font-bold">{activeStep.velocityMs.toFixed(2)} m/s</span>
              </div>
              <div className="flex items-center gap-1">
                <Radar className="w-4 h-4 text-secondary" />
                <span className="font-bold">
                  {result.success ? 'Lidar: Nominal' : 'Lidar: Halted'}
                </span>
              </div>
            </div>

            {/* Interactive Waypoint Progression Track */}
            <div className="relative z-10 w-full flex items-center justify-between px-1.5 pt-2">
              {waypointSamples.map((wp, idx) => {
                const wpRatio =
                  waypointSamples.length > 1 ? idx / (waypointSamples.length - 1) : 1;
                const reached = result.success && progressRatio >= wpRatio - 0.01;
                const isLast = idx === waypointSamples.length - 1;
                const isFirst = idx === 0;

                return (
                  <React.Fragment key={`${wp.label}-${idx}`}>
                    <div className="flex flex-col items-center shrink-0">
                      <span
                        className={`w-4 h-4 rounded-full font-mono text-[9px] flex items-center justify-center font-bold transition-colors ${
                          !reached
                            ? 'bg-surface-container-highest text-on-surface-variant'
                            : isFirst
                              ? 'bg-emerald-600 text-white'
                              : isLast
                                ? 'bg-secondary text-white'
                                : 'bg-primary text-white'
                        }`}
                      >
                        {wp.label}
                      </span>
                      <span
                        className={`text-[10px] font-mono mt-0.5 tabular-nums ${
                          isLast && reached
                            ? 'font-bold text-secondary'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        ({wp.coord.x},{wp.coord.y})
                      </span>
                    </div>

                    {idx < waypointSamples.length - 1 && (
                      <div className="h-1 flex-1 mx-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            idx === 0
                              ? 'bg-emerald-500'
                              : idx === waypointSamples.length - 2
                                ? 'bg-secondary'
                                : 'bg-primary'
                          }`}
                          style={{
                            width:
                              !result.success
                                ? '0%'
                                : progressRatio >= (idx + 1) / (waypointSamples.length - 1)
                                  ? '100%'
                                  : progressRatio > idx / (waypointSamples.length - 1)
                                    ? '55%'
                                    : '0%',
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Bottom Proximity & Active Waypoint Readout */}
            <div className="relative z-10 flex items-center justify-between gap-2 text-[10px] font-mono pt-1.5">
              <span className="text-on-surface-variant tabular-nums whitespace-nowrap">
                Proximity: {activeStep.nearestObstacleDistM.toFixed(2)}m
              </span>
              <span
                className={`font-semibold truncate ${
                  result.success ? 'text-emerald-700' : 'text-error'
                }`}
              >
                {activeStep.statusLabel}
              </span>
            </div>
          </div>

          {/* Simulation Control Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onRestartSim}
              className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/60 text-[13px] text-on-surface font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Sim</span>
            </button>
            <button
              type="button"
              onClick={onStepForward}
              disabled={!result.success || totalSteps <= 1}
              className="flex-1 py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary-container disabled:opacity-50 text-on-secondary text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span>Step (dt=0.1s)</span>
            </button>
          </div>
        </div>

        {/* Right: Dark Terminal Console Log */}
        <div className="min-h-[248px] max-h-[280px] bg-[#0F172A] rounded-lg p-3.5 font-mono text-[11px] text-slate-200 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>STDOUT / Execution Log</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
            </div>
          </div>

          {/* Terminal Stream */}
          <div className="sandbox-scroll flex-1 overflow-y-auto space-y-1 pr-1 select-text leading-snug">
            {terminalLines.map((line) => (
              <p key={line.id} className={TONE_CLASS[line.tone]}>
                {line.text}
              </p>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Bottom Terminal Status Bar */}
          <div className="pt-2.5 mt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {result.success ? (
              <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                STATUS: 0 ERRORS - SUCCESS ({totalMoves} steps)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-rose-950 text-rose-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                STATUS: 1 ERROR - HALTED
              </span>
            )}

            <span className="text-[11px] text-slate-400 tabular-nums">
              Runtime: {result.runtimeMs}ms | Memory: {result.memoryMb.toFixed(1)} MB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function buildWaypointSamples(
  path: { x: number; y: number }[],
  start: { x: number; y: number },
  target: { x: number; y: number },
) {
  if (path.length <= 2) {
    return [
      { label: 'A', coord: start },
      { label: 'B', coord: target },
    ];
  }
  if (path.length <= 4) {
    return path.map((coord, i) => ({
      label: i === 0 ? 'A' : i === path.length - 1 ? 'B' : String(i),
      coord,
    }));
  }
  const idx1 = 1;
  const idx2 = Math.floor((path.length - 1) * 0.45);
  return [
    { label: 'A', coord: path[0] },
    { label: '1', coord: path[idx1] },
    { label: '2', coord: path[Math.max(idx1 + 1, idx2)] },
    { label: 'B', coord: path[path.length - 1] },
  ];
}
