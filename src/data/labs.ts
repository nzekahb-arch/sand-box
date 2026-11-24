import { ChallengeItem, LabConfig } from '../types/sandbox';

export const LABS: LabConfig[] = [
  {
    id: 'lab-04',
    labBadge: 'Lab 04',
    difficulty: 'Intermediate',
    moduleLabel: 'Module 02',
    moduleTitle: 'Autonomous Kinematics',
    sessionId: 'Session #492-B',
    title: 'Autonomous Rover Navigation',
    subtitle: 'Autonomous pathfinding & obstacle avoidance via A* heuristics.',
    fileName: 'rover_controller.py',
    gridSize: { x: 6, y: 6 },
    start: { x: 0, y: 0 },
    target: { x: 5, y: 4 },
    obstacles: [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 4 },
    ],
    heuristicWeight: 1.25,
    initialBattery: 98.5,
    hintCodeRefs: ['rover.scan_surroundings()', 'rover.step_forward()'],
    hintText:
      'Ensure rover.scan_surroundings() checks all 4 cardinal directions before invoking rover.step_forward() to prevent dead-end traps.',
    objectives: [
      { id: 'obj-1', label: 'Initialize Rover sensor array', status: 'done' },
      { id: 'obj-2', label: 'Calibrate lidar distance threshold', status: 'done' },
      { id: 'obj-3', label: 'Implement A* waypoint traversal logic', status: 'active' },
      { id: 'obj-4', label: 'Avoid dynamic grid obstacles', status: 'pending' },
    ],
    xpReward: 150,
    starterCode: `# Import STEM Rover API
from stem_robotics import Rover, GridMap, Sensor

rover = Rover(grid_size=(6, 6), start=(0, 0), battery=98.5)
obstacles = [(1, 2), (2, 2), (3, 2), (4, 4)]

def navigate_to_target(target=(5, 4)):
    print(f"[*] Planning trajectory to target: {target}")
    while rover.position != target:
        sensors = rover.scan_surroundings()
        next_step = rover.calculate_a_star(target, obstacles)
        rover.move_to(next_step)
    print("[+] Destination reached successfully!")
navigate_to_target()`,
  },
  {
    id: 'lab-05',
    labBadge: 'Lab 05',
    difficulty: 'Advanced',
    moduleLabel: 'Module 02',
    moduleTitle: 'Autonomous Kinematics',
    sessionId: 'Session #518-A',
    title: 'Canyon Bottleneck Routing',
    subtitle: 'Navigate a narrow S-curve hazard corridor with minimal battery drain.',
    fileName: 'canyon_router.py',
    gridSize: { x: 6, y: 6 },
    start: { x: 0, y: 5 },
    target: { x: 5, y: 0 },
    obstacles: [
      { x: 1, y: 5 },
      { x: 1, y: 4 },
      { x: 1, y: 3 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
    ],
    heuristicWeight: 1.0,
    initialBattery: 92.0,
    hintCodeRefs: ['rover.scan_surroundings()', 'rover.calculate_a_star()'],
    hintText:
      'Keep heuristic_weight=1.0 for guaranteed optimal path length inside U-shaped canyon traps.',
    objectives: [
      { id: 'obj-1', label: 'Initialize Rover at southern canyon rim', status: 'done' },
      { id: 'obj-2', label: 'Enable 360-degree lidar sweep', status: 'active' },
      { id: 'obj-3', label: 'Route around vertical canyon walls', status: 'pending' },
      { id: 'obj-4', label: 'Dock at northern Goal Beacon (5, 0)', status: 'pending' },
    ],
    xpReward: 220,
    starterCode: `# Canyon Bottleneck S-Curve Navigation
from stem_robotics import Rover, GridMap, Sensor

rover = Rover(grid_size=(6, 6), start=(0, 5), battery=92.0)
obstacles = [(1, 5), (1, 4), (1, 3), (3, 0), (3, 1), (3, 2), (3, 3)]
heuristic_weight = 1.0

def navigate_to_target(target=(5, 0)):
    print(f"[*] Planning trajectory to target: {target}")
    while rover.position != target:
        sensors = rover.scan_surroundings()
        next_step = rover.calculate_a_star(target, obstacles)
        rover.move_to(next_step)
    print("[+] Canyon traversal verified!")
navigate_to_target()`,
  },
  {
    id: 'lab-06',
    labBadge: 'Lab 06',
    difficulty: 'Beginner',
    moduleLabel: 'Module 01',
    moduleTitle: 'Sensor Foundations',
    sessionId: 'Session #304-C',
    title: 'Diagonal Perimeter Sweep',
    subtitle: 'Baseline cardinal waypoint sweep across a low-density hazard field.',
    fileName: 'perimeter_sweep.py',
    gridSize: { x: 6, y: 6 },
    start: { x: 0, y: 0 },
    target: { x: 4, y: 5 },
    obstacles: [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 4 },
    ],
    heuristicWeight: 1.25,
    initialBattery: 100.0,
    hintCodeRefs: ['Rover()', 'rover.move_to()'],
    hintText:
      'Modify the target coordinate inside navigate_to_target() or click grid cells to test custom hazard placements.',
    objectives: [
      { id: 'obj-1', label: 'Boot STEM Rover telemetry bus', status: 'done' },
      { id: 'obj-2', label: 'Scan perimeter hazard blocks', status: 'active' },
      { id: 'obj-3', label: 'Compute A* Manhattan heuristic', status: 'pending' },
      { id: 'obj-4', label: 'Reach checkpoint (4, 5)', status: 'pending' },
    ],
    xpReward: 100,
    starterCode: `# Baseline Perimeter Sweep
from stem_robotics import Rover, GridMap, Sensor

rover = Rover(grid_size=(6, 6), start=(0, 0), battery=100.0)
obstacles = [(2, 1), (2, 2), (3, 4)]

def navigate_to_target(target=(4, 5)):
    print(f"[*] Planning trajectory to target: {target}")
    while rover.position != target:
        sensors = rover.scan_surroundings()
        next_step = rover.calculate_a_star(target, obstacles)
        rover.move_to(next_step)
    print("[+] Perimeter sweep completed!")
navigate_to_target()`,
  },
];

export const CHALLENGES: ChallengeItem[] = [
  {
    id: 'chal-1',
    title: 'Zero-Collision Slalom',
    description:
      'Guide the Rover from (0, 0) to (5, 5) through staggered slalom gates without touching any hazard block.',
    difficulty: 'Beginner',
    xpReward: 120,
    labId: 'lab-04',
    targetCoord: { x: 5, y: 5 },
    targetObstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 4 },
      { x: 3, y: 5 },
    ],
    starterCode: `# Challenge: Zero-Collision Slalom
from stem_robotics import Rover, GridMap, Sensor

rover = Rover(grid_size=(6, 6), start=(0, 0), battery=99.0)
obstacles = [(1, 0), (1, 1), (3, 4), (3, 5)]

def navigate_to_target(target=(5, 5)):
    print(f"[*] Planning trajectory to target: {target}")
    while rover.position != target:
        sensors = rover.scan_surroundings()
        next_step = rover.calculate_a_star(target, obstacles)
        rover.move_to(next_step)
    print("[+] Slalom gates cleared!")
navigate_to_target()`,
  },
  {
    id: 'chal-2',
    title: 'Dead-End Escape Matrix',
    description:
      'Break out of a three-sided containment pocket using admissible A* backtracking and reach (5, 2).',
    difficulty: 'Intermediate',
    xpReward: 200,
    labId: 'lab-04',
    targetCoord: { x: 5, y: 2 },
    targetObstacles: [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 1 },
      { x: 1, y: 3 },
    ],
    starterCode: `# Challenge: Dead-End Escape Matrix
from stem_robotics import Rover, GridMap, Sensor

rover = Rover(grid_size=(6, 6), start=(0, 2), battery=95.0)
obstacles = [(2, 1), (2, 2), (2, 3), (1, 1), (1, 3)]
heuristic_weight = 1.0

def navigate_to_target(target=(5, 2)):
    print(f"[*] Planning trajectory to target: {target}")
    while rover.position != target:
        sensors = rover.scan_surroundings()
        next_step = rover.calculate_a_star(target, obstacles)
        rover.move_to(next_step)
    print("[+] Escaped pocket trap!")
navigate_to_target()`,
  },
  {
    id: 'chal-3',
    title: 'High-Speed Heuristic Sprint',
    description:
      'Tune heuristic_weight to 1.50 and traverse diagonally across a dense asteroid field to (5, 4).',
    difficulty: 'Advanced',
    xpReward: 300,
    labId: 'lab-05',
    targetCoord: { x: 5, y: 4 },
    targetObstacles: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
    ],
    starterCode: `# Challenge: High-Speed Heuristic Sprint
from stem_robotics import Rover, GridMap, Sensor

rover = Rover(grid_size=(6, 6), start=(0, 0), battery=88.0)
obstacles = [(1, 1), (1, 2), (2, 3), (3, 1), (3, 2), (4, 3), (4, 4)]
heuristic_weight = 1.50

def navigate_to_target(target=(5, 4)):
    print(f"[*] Planning trajectory to target: {target}")
    while rover.position != target:
        sensors = rover.scan_surroundings()
        next_step = rover.calculate_a_star(target, obstacles)
        rover.move_to(next_step)
    print("[+] High-speed sprint complete!")
navigate_to_target()`,
  },
];

export const API_REFERENCE_ITEMS = [
  {
    symbol: 'Rover(grid_size=(6, 6), start=(0, 0), battery=98.5)',
    category: 'Class Constructor',
    summary:
      'Initializes a virtual autonomous rover instance bound to a 2D Cartesian grid map with initial pose and battery telemetry.',
    params: [
      'grid_size: tuple[int, int] — Width and height of the Cartesian grid.',
      'start: tuple[int, int] — Initial (x, y) coordinates.',
      'battery: float — Initial battery state-of-charge percentage.',
    ],
  },
  {
    symbol: 'rover.scan_surroundings() -> dict',
    category: 'Sensor Telemetry',
    summary:
      'Polls the 360° Lidar subsystem across all 4 cardinal directions (N, E, S, W) and returns obstacle clearance distances in meters.',
    params: ['Returns clearance map and updates Lidar nominal/alert state.'],
  },
  {
    symbol: 'rover.calculate_a_star(target, obstacles) -> tuple[int, int]',
    category: 'Pathfinding Kernel',
    summary:
      'Evaluates f(n) = g(n) + w · h(n) using Manhattan heuristic distance h(n) and returns the next optimal collision-free waypoint.',
    params: [
      'target: tuple[int, int] — Destination beacon coordinates.',
      'obstacles: list[tuple[int, int]] — List of occupied hazard coordinates.',
    ],
  },
  {
    symbol: 'rover.move_to(next_step) -> None',
    category: 'Actuator Control',
    summary:
      'Commands differential drive actuators to advance one grid unit toward next_step, updating pose (X, Y, θ), velocity, and battery.',
    params: ['next_step: tuple[int, int] — Adjacent cardinal coordinate.'],
  },
];
