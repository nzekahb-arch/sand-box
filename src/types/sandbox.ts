export type NavTabId =
  | 'dashboard'
  | 'code-playground'
  | 'robotics-lab'
  | 'physics-and-math'
  | 'challenges'
  | 'my-projects'
  | 'documentation'
  | 'settings';

export interface GridCoord {
  x: number;
  y: number;
}

export interface LabObjective {
  id: string;
  label: string;
  status: 'done' | 'active' | 'pending';
}

export interface LabConfig {
  id: string;
  labBadge: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  moduleLabel: string;
  moduleTitle: string;
  sessionId: string;
  title: string;
  subtitle: string;
  fileName: string;
  gridSize: GridCoord;
  start: GridCoord;
  target: GridCoord;
  obstacles: GridCoord[];
  heuristicWeight: number;
  initialBattery: number;
  hintCodeRefs: string[];
  hintText: string;
  starterCode: string;
  objectives: LabObjective[];
  xpReward: number;
}

export interface TerminalLine {
  id: string;
  text: string;
  tone: 'muted' | 'cyan' | 'slate' | 'indigo' | 'emerald' | 'yellow' | 'error';
}

export interface SimulationStep {
  stepIndex: number;
  position: GridCoord;
  headingDeg: number;
  battery: number;
  velocityMs: number;
  lidarClearanceM: number;
  nearestObstacleDistM: number;
  avoidedObstacle: GridCoord | null;
  statusLabel: string;
}

export interface ExecutionResult {
  success: boolean;
  errorMessage?: string;
  gridSize: GridCoord;
  start: GridCoord;
  target: GridCoord;
  obstacles: GridCoord[];
  heuristicWeight: number;
  path: GridCoord[];
  exploredNodes: GridCoord[];
  steps: SimulationStep[];
  terminalLines: TerminalLine[];
  runtimeMs: number;
  memoryMb: number;
  euclideanDistance: number;
  minClearPathLabel: 'Optimal' | 'Suboptimal' | 'Blocked';
  completedObjectiveIds: string[];
}

export interface SavedProject {
  id: string;
  name: string;
  labId: string;
  labTitle: string;
  fileName: string;
  code: string;
  updatedAt: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  labId: string;
  starterCode: string;
  targetObstacles: GridCoord[];
  targetCoord: GridCoord;
  completed?: boolean;
}

export interface SandboxSettings {
  editorFontSize: number;
  stepDelayMs: number;
  defaultHeuristicWeight: number;
  hardwareBridgeConnected: boolean;
  showExploredNodes: boolean;
}
