import { ExecutionResult, GridCoord, LabConfig, TerminalLine } from '../types/sandbox';
import { coordKey, sameCoord, solveGridPath } from './astar';

function parseTuple(raw: string): GridCoord | null {
  const match = raw.match(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
  if (!match) return null;
  return { x: Number(match[1]), y: Number(match[2]) };
}

function parseTupleList(raw: string): GridCoord[] {
  const results: GridCoord[] = [];
  const regex = /\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(raw)) !== null) {
    results.push({ x: Number(m[1]), y: Number(m[2]) });
  }
  return results;
}

export function executeRoverPython(
  code: string,
  lab: LabConfig,
  overrideWeight?: number,
): ExecutionResult {
  const startTime = performance.now();
  const lines = code.split(/\r?\n/);

  // Basic structural validation for authentic Python feedback
  let openParens = 0;
  let openBrackets = 0;
  let syntaxError: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    for (const ch of trimmed) {
      if (ch === '(') openParens++;
      if (ch === ')') openParens--;
      if (ch === '[') openBrackets++;
      if (ch === ']') openBrackets--;
    }
    if (openParens < 0 || openBrackets < 0) {
      syntaxError = `SyntaxError: unmatched delimiter on line ${i + 1}`;
      break;
    }
    if (
      (trimmed.startsWith('def ') || trimmed.startsWith('while ') || trimmed.startsWith('if ')) &&
      !trimmed.endsWith(':')
    ) {
      syntaxError = `SyntaxError: expected ':' on line ${i + 1}`;
      break;
    }
  }

  if (!syntaxError && openParens !== 0) {
    syntaxError = `SyntaxError: '(' was never closed`;
  }
  if (!syntaxError && openBrackets !== 0) {
    syntaxError = `SyntaxError: '[' was never closed`;
  }

  // Extract Rover(...) configuration
  const gridMatch = code.match(/grid_size\s*=\s*(\([^)]*\))/);
  const startMatch = code.match(/start\s*=\s*(\([^)]*\))/);
  const batteryMatch = code.match(/battery\s*=\s*([0-9]+(?:\.[0-9]+)?)/);
  const obstaclesMatch = code.match(/obstacles\s*=\s*(\[[^\]]*\])/);
  const targetMatch = code.match(/target\s*=\s*(\([^)]*\))/);
  const weightMatch = code.match(/heuristic_weight\s*=\s*([0-9]+(?:\.[0-9]+)?)/);
  const callTargetMatch = code.match(/navigate_to_target\s*\(\s*(?:target\s*=\s*)?(\([^)]*\))\s*\)/);

  const gridSize = (gridMatch && parseTuple(gridMatch[1])) || lab.gridSize;
  const start = (startMatch && parseTuple(startMatch[1])) || lab.start;
  const initialBattery = batteryMatch ? Number(batteryMatch[1]) : lab.initialBattery;
  const obstacles = obstaclesMatch ? parseTupleList(obstaclesMatch[1]) : lab.obstacles;
  const target =
    (callTargetMatch && parseTuple(callTargetMatch[1])) ||
    (targetMatch && parseTuple(targetMatch[1])) ||
    lab.target;
  const heuristicWeight =
    overrideWeight ?? (weightMatch ? Number(weightMatch[1]) : lab.heuristicWeight);

  const terminalLines: TerminalLine[] = [
    { id: 'cmd', text: `$ python3 ${lab.fileName}`, tone: 'muted' },
  ];

  if (syntaxError) {
    terminalLines.push(
      { id: 'err-1', text: `  File "${lab.fileName}"`, tone: 'error' },
      { id: 'err-2', text: syntaxError, tone: 'error' },
    );
    return {
      success: false,
      errorMessage: syntaxError,
      gridSize,
      start,
      target,
      obstacles,
      heuristicWeight,
      path: [],
      exploredNodes: [],
      steps: [],
      terminalLines,
      runtimeMs: 12,
      memoryMb: 8.4,
      euclideanDistance: 0,
      minClearPathLabel: 'Blocked',
      completedObjectiveIds: [],
    };
  }

  // Check if essential API calls exist in user code
  const hasImport = /stem_robotics/.test(code);
  const hasRoverInit = /Rover\s*\(/.test(code);
  const hasScan = /scan_surroundings\s*\(/.test(code);
  const hasAStar = /calculate_a_star\s*\(|a_star/i.test(code);
  const hasMove = /move_to\s*\(|step_forward\s*\(/.test(code);
  const invokesNavigate = /navigate_to_target\s*\(/.test(code) || !/def\s+navigate_to_target/.test(code);

  if (!hasImport || !hasRoverInit) {
    const err = !hasImport
      ? `ImportError: stem_robotics module not imported`
      : `NameError: name 'rover' is not defined (initialize Rover(...))`;
    terminalLines.push({ id: 'err-import', text: err, tone: 'error' });
    return {
      success: false,
      errorMessage: err,
      gridSize,
      start,
      target,
      obstacles,
      heuristicWeight,
      path: [],
      exploredNodes: [],
      steps: [],
      terminalLines,
      runtimeMs: 18,
      memoryMb: 9.1,
      euclideanDistance: 0,
      minClearPathLabel: 'Blocked',
      completedObjectiveIds: [],
    };
  }

  terminalLines.push(
    {
      id: 'init',
      text: `[*] Initialising Rover v2.4 hardware subsystem... OK`,
      tone: 'cyan',
    },
    {
      id: 'lidar',
      text: hasScan
        ? `[*] Lidar calibration: 360 beams active, 0 blindspots`
        : `[!] Warning: rover.scan_surroundings() not invoked; using cached map`,
      tone: hasScan ? 'slate' : 'yellow',
    },
  );

  // Validate bounds & obstacle collisions
  const inBounds = (c: GridCoord) =>
    c.x >= 0 && c.y >= 0 && c.x < gridSize.x && c.y < gridSize.y;

  if (!inBounds(start) || !inBounds(target)) {
    const err = `ValueError: coordinates out of ${gridSize.x}x${gridSize.y} GridMap bounds`;
    terminalLines.push({ id: 'err-bounds', text: err, tone: 'error' });
    return {
      success: false,
      errorMessage: err,
      gridSize,
      start,
      target,
      obstacles,
      heuristicWeight,
      path: [],
      exploredNodes: [],
      steps: [],
      terminalLines,
      runtimeMs: 24,
      memoryMb: 10.2,
      euclideanDistance: 0,
      minClearPathLabel: 'Blocked',
      completedObjectiveIds: ['obj-1'],
    };
  }

  const obsSet = new Set(obstacles.map(coordKey));
  if (obsSet.has(coordKey(target))) {
    const err = `NavigationError: Goal beacon (${target.x}, ${target.y}) is occupied by a hazard block`;
    terminalLines.push({ id: 'err-target', text: err, tone: 'error' });
    return {
      success: false,
      errorMessage: err,
      gridSize,
      start,
      target,
      obstacles,
      heuristicWeight,
      path: [],
      exploredNodes: [],
      steps: [],
      terminalLines,
      runtimeMs: 29,
      memoryMb: 11.0,
      euclideanDistance: 0,
      minClearPathLabel: 'Blocked',
      completedObjectiveIds: ['obj-1', 'obj-2'],
    };
  }

  if (!invokesNavigate || !hasMove) {
    const msg = !invokesNavigate
      ? `[!] navigate_to_target() defined but not called. Rover idle at (${start.x}, ${start.y}).`
      : `[!] No rover.move_to() instruction detected. Rover stationary at (${start.x}, ${start.y}).`;
    terminalLines.push({ id: 'warn-idle', text: msg, tone: 'yellow' });
    return {
      success: false,
      errorMessage: 'Rover did not dispatch movement commands',
      gridSize,
      start,
      target,
      obstacles,
      heuristicWeight,
      path: [start],
      exploredNodes: [start],
      steps: [],
      terminalLines,
      runtimeMs: 32,
      memoryMb: 11.4,
      euclideanDistance: Math.hypot(target.x - start.x, target.y - start.y),
      minClearPathLabel: 'Suboptimal',
      completedObjectiveIds: hasScan ? ['obj-1', 'obj-2'] : ['obj-1'],
    };
  }

  // Solve actual A* path
  const solved = solveGridPath({
    gridSize,
    start,
    target,
    obstacles,
    heuristicWeight,
    initialBattery,
    algorithm: 'astar',
  });

  if (!solved.found) {
    const err = `PathNotFoundError: No obstacle-free trajectory from (${start.x},${start.y}) to (${target.x},${target.y})`;
    terminalLines.push(
      {
        id: 'plan-fail',
        text: `[*] Planning trajectory to target: (${target.x}, ${target.y})`,
        tone: 'indigo',
      },
      { id: 'err-path', text: err, tone: 'error' },
    );
    return {
      success: false,
      errorMessage: err,
      gridSize,
      start,
      target,
      obstacles,
      heuristicWeight,
      path: [start],
      exploredNodes: solved.explored,
      steps: [],
      terminalLines,
      runtimeMs: Math.max(45, Math.round(performance.now() - startTime + 38)),
      memoryMb: 12.8,
      euclideanDistance: solved.euclideanDistance,
      minClearPathLabel: 'Blocked',
      completedObjectiveIds: ['obj-1', 'obj-2'],
    };
  }

  terminalLines.push({
    id: 'plan',
    text: `[*] Planning trajectory to target: (${target.x}, ${target.y}) [h(n)=${heuristicWeight.toFixed(2)}]`,
    tone: 'indigo',
  });

  // Log step transitions
  for (let i = 1; i < solved.steps.length; i++) {
    const prev = solved.steps[i - 1].position;
    const cur = solved.steps[i].position;
    const step = solved.steps[i];
    const isLast = i === solved.steps.length - 1;
    let annotation = `[Lidar clearance: ${step.lidarClearanceM}m]`;
    if (step.avoidedObstacle && i % 2 === 0) {
      annotation = `[Avoided obstacle at (${step.avoidedObstacle.x},${step.avoidedObstacle.y})]`;
    } else if (isLast) {
      annotation = `[Target reached]`;
    } else if (i % 3 === 0) {
      annotation = `[Velocity: ${step.velocityMs.toFixed(2)} m/s]`;
    }

    terminalLines.push({
      id: `step-${i}`,
      text: `[>] Step ${i}: Moved (${prev.x},${prev.y}) -> (${cur.x},${cur.y}) ${annotation}`,
      tone: 'slate',
    });
  }

  const totalMoves = Math.max(0, solved.path.length - 1);

  // Extract custom print() calls (outside standard ones) if user added prints
  const customPrintMatches = [...code.matchAll(/print\(\s*f?["']([^"']+)["']\s*\)/g)];
  for (let p = 0; p < customPrintMatches.length; p++) {
    const rawMsg = customPrintMatches[p][1];
    if (
      !rawMsg.includes('Planning trajectory') &&
      !rawMsg.includes('Destination reached')
    ) {
      terminalLines.push({
        id: `custom-print-${p}`,
        text: rawMsg.replace(/\{target\}/g, `(${target.x}, ${target.y})`),
        tone: 'cyan',
      });
    }
  }

  terminalLines.push({
    id: 'done',
    text: `[+] Status: Execution Complete. Target Reached in ${totalMoves} steps.`,
    tone: 'emerald',
  });

  // Check if path is optimal vs unweighted A* (w=1.0)
  const optimalSolved =
    heuristicWeight > 1.0
      ? solveGridPath({
          gridSize,
          start,
          target,
          obstacles,
          heuristicWeight: 1.0,
          initialBattery,
          algorithm: 'astar',
        })
      : solved;

  const isOptimal =
    optimalSolved.found && solved.path.length <= optimalSolved.path.length;

  const completedObjectiveIds = ['obj-1'];
  if (hasScan) completedObjectiveIds.push('obj-2');
  if (hasAStar) completedObjectiveIds.push('obj-3');
  if (solved.found && !sameCoord(start, target)) completedObjectiveIds.push('obj-4');

  const elapsed = Math.max(120, Math.round((performance.now() - startTime) * 10 + 380 + totalMoves * 4));

  return {
    success: true,
    gridSize,
    start,
    target,
    obstacles,
    heuristicWeight,
    path: solved.path,
    exploredNodes: solved.explored,
    steps: solved.steps,
    terminalLines,
    runtimeMs: elapsed,
    memoryMb: Number((13.6 + totalMoves * 0.08).toFixed(1)),
    euclideanDistance: solved.euclideanDistance,
    minClearPathLabel: isOptimal ? 'Optimal' : 'Suboptimal',
    completedObjectiveIds,
  };
}
