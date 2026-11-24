import React, { useState } from 'react';
import { GridCoord } from '../types/sandbox';
import { coordKey, sameCoord } from '../engine/astar';

interface PathfindingGridProps {
  gridSize: GridCoord;
  start: GridCoord;
  target: GridCoord;
  obstacles: GridCoord[];
  path: GridCoord[];
  exploredNodes: GridCoord[];
  roverPos: GridCoord;
  roverHeadingDeg: number;
  showExploredNodes: boolean;
  onToggleObstacle: (coord: GridCoord) => void;
}

export const PathfindingGrid: React.FC<PathfindingGridProps> = ({
  gridSize,
  start,
  target,
  obstacles,
  path,
  exploredNodes,
  roverPos,
  roverHeadingDeg,
  showExploredNodes,
  onToggleObstacle,
}) => {
  const [hoveredCell, setHoveredCell] = useState<GridCoord | null>(null);

  const cellSize = 40;
  const width = gridSize.x * cellSize;
  const height = gridSize.y * cellSize;

  const obstacleSet = new Set(obstacles.map(coordKey));
  const exploredSet = new Set(exploredNodes.map(coordKey));

  const centerOf = (c: GridCoord) => ({
    cx: c.x * cellSize + cellSize / 2,
    cy: c.y * cellSize + cellSize / 2,
  });

  const pathD =
    path.length > 1
      ? path
          .map((pt, idx) => {
            const { cx, cy } = centerOf(pt);
            return `${idx === 0 ? 'M' : 'L'} ${cx} ${cy}`;
          })
          .join(' ')
      : '';

  const startCenter = centerOf(start);
  const targetCenter = centerOf(target);
  const roverCenter = centerOf(roverPos);

  return (
    <div className="rounded-lg p-3.5 bg-surface-container-low border border-outline-variant/40">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
          2D Robotics Pathfinding Grid
        </span>
        <span className="font-mono text-[10px] text-secondary font-medium whitespace-nowrap">
          {hoveredCell
            ? `Cell: (${hoveredCell.x}, ${hoveredCell.y})`
            : `Map: Cartesian ${gridSize.x}x${gridSize.y}`}
        </span>
      </div>

      {/* Crisp SVG Simulation Preview Grid */}
      <div className="w-full bg-surface-container-lowest rounded-md p-2 flex items-center justify-center border border-outline-variant/40">
        <svg
          aria-label="Rover Navigation Grid"
          className="w-full max-w-[248px] h-auto select-none"
          viewBox={`0 0 ${width} ${height}`}
        >
          <defs>
            <pattern
              id="grid-pattern"
              width={cellSize}
              height={cellSize}
              patternUnits="userSpaceOnUse"
            >
              <rect
                width={cellSize}
                height={cellSize}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1.2"
              />
            </pattern>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#712EDD" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width={width} height={height} fill="#F8FAFC" />
          <rect width={width} height={height} fill="url(#grid-pattern)" />

          {/* Optional A* explored node tint */}
          {showExploredNodes &&
            Array.from({ length: gridSize.y }).map((_, row) =>
              Array.from({ length: gridSize.x }).map((__, col) => {
                const c = { x: col, y: row };
                if (
                  !exploredSet.has(coordKey(c)) ||
                  obstacleSet.has(coordKey(c)) ||
                  sameCoord(c, start) ||
                  sameCoord(c, target)
                ) {
                  return null;
                }
                return (
                  <rect
                    key={`exp-${col}-${row}`}
                    x={col * cellSize + 3}
                    y={row * cellSize + 3}
                    width={cellSize - 6}
                    height={cellSize - 6}
                    rx={4}
                    fill="#DCE1FF"
                    opacity={0.45}
                  />
                );
              }),
            )}

          {/* Obstacles (Hazard Blocks) */}
          {obstacles.map((obs) => (
            <rect
              key={`obs-${obs.x}-${obs.y}`}
              x={obs.x * cellSize + 2}
              y={obs.y * cellSize + 2}
              width={cellSize - 4}
              height={cellSize - 4}
              rx={4}
              fill="#334155"
            />
          ))}

          {/* Planned Path Dashed Breadcrumbs */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#pathGradient)"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeWidth="3"
            />
          )}

          {/* Breadcrumb Nodes */}
          {path.slice(1, -1).map((pt) => {
            const { cx, cy } = centerOf(pt);
            return (
              <circle
                key={`node-${pt.x}-${pt.y}`}
                cx={cx}
                cy={cy}
                r="3"
                fill="#1D4ED8"
              />
            );
          })}

          {/* Start Marker if Rover has moved */}
          {!sameCoord(roverPos, start) && (
            <g opacity="0.7">
              <circle
                cx={startCenter.cx}
                cy={startCenter.cy}
                r="6"
                fill="#DCFCE7"
                stroke="#16A34A"
                strokeWidth="1.5"
              />
              <text
                x={startCenter.cx}
                y={Math.min(height - 4, startCenter.cy + 16)}
                fill="#16A34A"
                fontFamily="Inter"
                fontSize="8"
                fontWeight="700"
                textAnchor="middle"
              >
                START
              </text>
            </g>
          )}

          {/* Target Destination Beacon */}
          <g>
            <circle
              cx={targetCenter.cx}
              cy={targetCenter.cy}
              r="14"
              fill="#EBDDFF"
              opacity="0.6"
            />
            <circle cx={targetCenter.cx} cy={targetCenter.cy} r="9" fill="#712EDD" />
            <circle cx={targetCenter.cx} cy={targetCenter.cy} r="3" fill="#FFFFFF" />
            <text
              x={targetCenter.cx}
              y={targetCenter.cy < 26 ? targetCenter.cy + 22 : targetCenter.cy - 18}
              fill="#712EDD"
              fontFamily="Inter"
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              GOAL B
            </text>
          </g>

          {/* Active Rover Marker */}
          <g
            className="transition-all duration-300"
            style={{
              transformOrigin: `${roverCenter.cx}px ${roverCenter.cy}px`,
            }}
          >
            <circle cx={roverCenter.cx} cy={roverCenter.cy} r="13" fill="#DCFCE7" />
            <circle cx={roverCenter.cx} cy={roverCenter.cy} r="8" fill="#16A34A" />
            <g
              transform={`translate(${roverCenter.cx}, ${roverCenter.cy}) rotate(${
                roverHeadingDeg === 0
                  ? 90
                  : roverHeadingDeg === 180
                    ? -90
                    : roverHeadingDeg === 90
                      ? 180
                      : 0
              })`}
            >
              <path d="M 0 -5 L 4 3 L 0 1 L -4 3 Z" fill="#FFFFFF" />
            </g>
            <text
              x={roverCenter.cx}
              y={roverCenter.cy > height - 22 ? roverCenter.cy - 16 : roverCenter.cy + 20}
              fill="#16A34A"
              fontFamily="Inter"
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              ROVER A
            </text>
          </g>

          {/* Interactive Click Overlay Cells */}
          {Array.from({ length: gridSize.y }).map((_, row) =>
            Array.from({ length: gridSize.x }).map((__, col) => {
              const c = { x: col, y: row };
              const locked = sameCoord(c, start) || sameCoord(c, target);
              return (
                <rect
                  key={`hit-${col}-${row}`}
                  x={col * cellSize}
                  y={row * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={
                    hoveredCell && sameCoord(hoveredCell, c) && !locked
                      ? 'rgba(29, 78, 216, 0.08)'
                      : 'transparent'
                  }
                  className={locked ? 'cursor-not-allowed' : 'cursor-pointer'}
                  onMouseEnter={() => setHoveredCell(c)}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() => {
                    if (!locked) onToggleObstacle(c);
                  }}
                >
                  <title>
                    {locked
                      ? `(${col}, ${row}) Locked`
                      : obstacleSet.has(coordKey(c))
                        ? `(${col}, ${row}) Click to clear hazard`
                        : `(${col}, ${row}) Click to place hazard`}
                  </title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>

      {/* Legend strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 px-1 text-[11px] text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          Rover Start ({start.x},{start.y})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-slate-700 inline-block" />
          Hazard Block
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />
          Goal Beacon
        </span>
      </div>
    </div>
  );
};
