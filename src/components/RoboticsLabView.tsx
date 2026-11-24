import React, { useMemo, useState } from 'react';
import { Cpu, RotateCcw, Send } from 'lucide-react';
import { GridCoord } from '../types/sandbox';
import {
  coordKey,
  PathAlgorithm,
  sameCoord,
  solveGridPath,
} from '../engine/astar';

interface RoboticsLabViewProps {
  onSendToPlayground: (params: {
    obstacles: GridCoord[];
    heuristicWeight: number;
    target: GridCoord;
  }) => void;
}

const DEFAULT_OBSTACLES: GridCoord[] = [
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 5, y: 3 },
  { x: 5, y: 4 },
  { x: 5, y: 5 },
  { x: 5, y: 6 },
];

export const RoboticsLabView: React.FC<RoboticsLabViewProps> = ({
  onSendToPlayground,
}) => {
  const gridSize = { x: 8, y: 8 };
  const start = { x: 0, y: 0 };
  const target = { x: 7, y: 6 };

  const [algorithm, setAlgorithm] = useState<PathAlgorithm>('astar');
  const [weight, setWeight] = useState(1.25);
  const [obstacles, setObstacles] = useState<GridCoord[]>(DEFAULT_OBSTACLES);

  const solved = useMemo(
    () =>
      solveGridPath({
        gridSize,
        start,
        target,
        obstacles,
        heuristicWeight: weight,
        algorithm,
      }),
    [obstacles, weight, algorithm],
  );

  const obsSet = new Set(obstacles.map(coordKey));
  const pathSet = new Set(solved.path.map(coordKey));
  const expSet = new Set(solved.explored.map(coordKey));

  const toggleCell = (c: GridCoord) => {
    if (sameCoord(c, start) || sameCoord(c, target)) return;
    setObstacles((prev) =>
      prev.some((o) => sameCoord(o, c))
        ? prev.filter((o) => !sameCoord(o, c))
        : [...prev, c],
    );
  };

  return (
    <div className="p-5 md:p-8 bg-surface w-full max-w-[1440px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
            Interactive Algorithm Workbench
          </span>
          <h1 className="text-[24px] leading-8 font-semibold text-on-surface tracking-tight mt-0.5">
            Robotics Lab: Search &amp; Heuristic Benchmarking
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            Click grid cells to paint hazards and compare node expansions across A*, Dijkstra, and BFS.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onSendToPlayground({
              obstacles: obstacles.filter((o) => o.x < 6 && o.y < 6),
              heuristicWeight: weight,
              target: { x: 5, y: 4 },
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white text-sm font-semibold cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Apply Heuristic to Playground</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-on-surface">Planner Parameters</h2>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Search Algorithm
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'astar', label: 'A* Search' },
                  { id: 'dijkstra', label: 'Dijkstra' },
                  { id: 'bfs', label: 'BFS' },
                ] as { id: PathAlgorithm; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAlgorithm(opt.id)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    algorithm === opt.id
                      ? 'bg-primary-container text-white border-primary-container'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/50 hover:bg-surface-container'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface-variant uppercase tracking-wider">
                Heuristic Weight h(n)
              </span>
              <span className="font-mono font-bold text-secondary tabular-nums">
                {algorithm === 'astar' ? weight.toFixed(2) : '0.00 (Uninformed)'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2.5}
              step={0.05}
              disabled={algorithm !== 'astar'}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-outline">
              <span>0.0 (Dijkstra)</span>
              <span>1.0 (Optimal)</span>
              <span>2.5 (Greedy)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-container">
            <div className="bg-surface-container-low rounded-lg p-3">
              <div className="font-mono text-[10px] uppercase text-outline">
                Nodes Expanded
              </div>
              <div className="text-xl font-bold text-primary tabular-nums mt-0.5">
                {solved.explored.length}
              </div>
            </div>
            <div className="bg-surface-container-low rounded-lg p-3">
              <div className="font-mono text-[10px] uppercase text-outline">
                Path Steps
              </div>
              <div className="text-xl font-bold text-emerald-700 tabular-nums mt-0.5">
                {solved.found ? solved.path.length - 1 : 'Blocked'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setObstacles(DEFAULT_OBSTACLES)}
            className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-xs font-semibold text-on-surface flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 8×8 Hazard Map</span>
          </button>
        </div>

        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="font-mono text-xs font-semibold uppercase text-on-surface-variant">
              8×8 Cartesian Occupancy Grid (Click cells to toggle obstacles)
            </span>
            <div className="flex items-center gap-4 text-[11px] text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary-fixed border border-primary/30 inline-block" />
                Explored
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary-container inline-block" />
                Trajectory
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-700 inline-block" />
                Hazard
              </span>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1.5 max-w-[480px] mx-auto bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
            {Array.from({ length: gridSize.y }).map((_, row) =>
              Array.from({ length: gridSize.x }).map((__, col) => {
                const c = { x: col, y: row };
                const k = coordKey(c);
                const isStart = sameCoord(c, start);
                const isTarget = sameCoord(c, target);
                const isObs = obsSet.has(k);
                const isPath = pathSet.has(k);
                const isExp = expSet.has(k);

                let bg = 'bg-surface-container-lowest hover:bg-surface-container';
                let text = 'text-outline';
                let label = `${col},${row}`;

                if (isStart) {
                  bg = 'bg-emerald-600 text-white';
                  text = 'text-white font-bold';
                  label = 'A';
                } else if (isTarget) {
                  bg = 'bg-secondary text-white';
                  text = 'text-white font-bold';
                  label = 'B';
                } else if (isObs) {
                  bg = 'bg-slate-700 hover:bg-slate-600';
                  text = 'text-slate-300';
                  label = '■';
                } else if (isPath) {
                  bg = 'bg-primary-container text-white';
                  text = 'text-white font-bold';
                } else if (isExp) {
                  bg = 'bg-primary-fixed/80 hover:bg-primary-fixed';
                  text = 'text-primary';
                }

                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleCell(c)}
                    className={`aspect-square rounded-md border border-outline-variant/40 flex items-center justify-center font-mono text-[11px] transition-colors cursor-pointer ${bg} ${text}`}
                  >
                    {label}
                  </button>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
