import { GridCoord, SimulationStep } from '../types/sandbox';

export type PathAlgorithm = 'astar' | 'dijkstra' | 'bfs';

export interface PathfindingOutput {
  found: boolean;
  path: GridCoord[];
  explored: GridCoord[];
  euclideanDistance: number;
  steps: SimulationStep[];
}

const CARDINAL_DIRS: GridCoord[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

export function coordKey(c: GridCoord): string {
  return `${c.x},${c.y}`;
}

export function sameCoord(a: GridCoord, b: GridCoord): boolean {
  return a.x === b.x && a.y === b.y;
}

export function euclideanDistance(a: GridCoord, b: GridCoord): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function manhattanDistance(a: GridCoord, b: GridCoord): number {
  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

export function nearestObstacleDistanceM(
  pos: GridCoord,
  obstacles: GridCoord[],
): number {
  if (obstacles.length === 0) return 6.0;
  let minDist = Infinity;
  for (const obs of obstacles) {
    const d = euclideanDistance(pos, obs);
    if (d < minDist) minDist = d;
  }
  // Convert grid cell unit (~1.3m per grid unit for realistic rover lidar telemetry)
  return Math.max(0.45, Number((minDist * 1.15).toFixed(2)));
}

export function computeHeadingDeg(from: GridCoord, to: GridCoord): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return 90;
  // Grid y increases downwards, x increases rightwards: 0° East, 90° South/Up-screen
  if (dx > 0) return 0;
  if (dx < 0) return 180;
  if (dy > 0) return 90;
  return 270;
}

export function solveGridPath(params: {
  gridSize: GridCoord;
  start: GridCoord;
  target: GridCoord;
  obstacles: GridCoord[];
  heuristicWeight?: number;
  initialBattery?: number;
  algorithm?: PathAlgorithm;
}): PathfindingOutput {
  const {
    gridSize,
    start,
    target,
    obstacles,
    heuristicWeight = 1.25,
    initialBattery = 98.5,
    algorithm = 'astar',
  } = params;

  const inBounds = (c: GridCoord) =>
    c.x >= 0 && c.y >= 0 && c.x < gridSize.x && c.y < gridSize.y;

  const obstacleSet = new Set(obstacles.map(coordKey));
  const euclid = euclideanDistance(start, target);

  if (
    !inBounds(start) ||
    !inBounds(target) ||
    obstacleSet.has(coordKey(start)) ||
    obstacleSet.has(coordKey(target))
  ) {
    return {
      found: false,
      path: [],
      explored: [],
      euclideanDistance: euclid,
      steps: [],
    };
  }

  const open: GridCoord[] = [start];
  const cameFrom = new Map<string, GridCoord>();
  const gScore = new Map<string, number>([[coordKey(start), 0]]);
  const fScore = new Map<string, number>([
    [
      coordKey(start),
      algorithm === 'astar' ? heuristicWeight * manhattanDistance(start, target) : 0,
    ],
  ]);
  const closed = new Set<string>();
  const explored: GridCoord[] = [];

  while (open.length > 0) {
    let bestIdx = 0;
    if (algorithm !== 'bfs') {
      for (let i = 1; i < open.length; i++) {
        const fA = fScore.get(coordKey(open[i])) ?? Infinity;
        const fB = fScore.get(coordKey(open[bestIdx])) ?? Infinity;
        if (fA < fB) {
          bestIdx = i;
        }
      }
    }

    const current = open.splice(bestIdx, 1)[0];
    const currentKey = coordKey(current);

    if (closed.has(currentKey)) continue;
    closed.add(currentKey);
    explored.push(current);

    if (sameCoord(current, target)) {
      const path: GridCoord[] = [current];
      let traceKey = currentKey;
      while (cameFrom.has(traceKey)) {
        const prev = cameFrom.get(traceKey)!;
        path.unshift(prev);
        traceKey = coordKey(prev);
      }

      const steps = buildSimulationSteps(path, obstacles, initialBattery);
      return {
        found: true,
        path,
        explored,
        euclideanDistance: euclid,
        steps,
      };
    }

    for (const dir of CARDINAL_DIRS) {
      const neighbor: GridCoord = { x: current.x + dir.x, y: current.y + dir.y };
      const nKey = coordKey(neighbor);
      if (!inBounds(neighbor) || obstacleSet.has(nKey) || closed.has(nKey)) {
        continue;
      }

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, current);
        gScore.set(nKey, tentativeG);
        const h =
          algorithm === 'astar'
            ? heuristicWeight * manhattanDistance(neighbor, target)
            : 0;
        fScore.set(nKey, tentativeG + h);
        if (!open.some((o) => sameCoord(o, neighbor))) {
          open.push(neighbor);
        }
      }
    }
  }

  return {
    found: false,
    path: [],
    explored,
    euclideanDistance: euclid,
    steps: [],
  };
}

function buildSimulationSteps(
  path: GridCoord[],
  obstacles: GridCoord[],
  initialBattery: number,
): SimulationStep[] {
  const obstacleSet = new Set(obstacles.map(coordKey));
  return path.map((pos, idx) => {
    const prev = idx > 0 ? path[idx - 1] : pos;
    const next = idx < path.length - 1 ? path[idx + 1] : pos;
    const headingDeg =
      idx === 0 && path.length > 1
        ? computeHeadingDeg(pos, next)
        : idx > 0
          ? computeHeadingDeg(prev, pos)
          : 90;

    // Detect if an obstacle was adjacent to previous or current node
    let avoidedObstacle: GridCoord | null = null;
    for (const d of CARDINAL_DIRS) {
      const check = { x: pos.x + d.x, y: pos.y + d.y };
      if (obstacleSet.has(coordKey(check))) {
        avoidedObstacle = check;
        break;
      }
    }

    const batteryDrop = idx * 0.45;
    const battery = Number(Math.max(5, initialBattery - batteryDrop).toFixed(1));
    const nearest = nearestObstacleDistanceM(pos, obstacles);
    const velocityMs = idx === 0 ? 0.0 : idx === path.length - 1 ? 0.45 : Number((0.42 + (idx % 3) * 0.03).toFixed(2));
    const isLast = idx === path.length - 1;

    return {
      stepIndex: idx,
      position: pos,
      headingDeg,
      battery,
      velocityMs,
      lidarClearanceM: Number((nearest + 0.35).toFixed(2)),
      nearestObstacleDistM: nearest,
      avoidedObstacle,
      statusLabel:
        idx === 0
          ? 'Rover Initialized at Origin'
          : isLast
            ? 'Target Reached (Goal Beacon)'
            : `Traversing Waypoint #${idx} (Active)`,
    };
  });
}
