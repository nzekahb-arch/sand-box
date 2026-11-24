# Core User Flow Screens & Stitch Design References

## 1. Stitch Source Artifacts

- **Design System Spec**: [DESIGN.md](./DESIGN.md) (`STEM Sandbox` — 60-30-10 light technical workspace)
- **Primary Reference Screen**: `code_playground_workspace_1` (`Module 02 > Autonomous Kinematics > Session #492-B`)

## 2. Implemented Screens & Primary User Flows

### Flow A: Autonomous Rover Code Execution (`Code Playground`)
1. Learner lands on **Code Playground** (`Lab 04: Autonomous Rover Navigation`).
2. Edits `rover_controller.py` in the line-numbered Python editor or clicks cells on the **2D Robotics Pathfinding Grid** to place/remove hazard blocks.
3. Clicks **Run Code** (`Ctrl+Enter`) to execute the `stem_robotics` script:
   - Solver validates syntax, bounds, and obstacle collisions (`src/engine/pythonSandbox.ts`).
   - A* pathfinder computes the trajectory (`src/engine/astar.ts`), animating the rover along waypoints while streaming step-by-step Lidar & velocity telemetry to `STDOUT / Execution Log`.
   - Objectives update automatically (`4 of 4 done`) and award `+150 XP` on completion.
4. Learner can click **Restart Sim** / **Step (dt=0.1s)** to inspect individual kinematic poses (`X | Y | θ`, battery `%`, obstacle proximity), or open **View Formula Docs** for the weighted A* cost equation.

### Flow B: Heuristic Benchmarking (`Robotics Lab` -> `Code Playground`)
1. Learner opens **Robotics Lab** from the sidebar.
2. Paints custom hazards on an 8×8 grid and compares **A*** (`h(n)` slider `0.0–2.5`), **Dijkstra**, and **BFS** node expansion counts.
3. Clicks **Apply Heuristic to Playground** to transfer the tuned `heuristic_weight` and hazard coordinates back into the Python script.

### Flow C: Script Persistence (`Code Playground` -> `My Projects`)
1. Learner clicks **Save** in the Code Editor toolbar.
2. Snapshot persists in `localStorage` and appears in **My Projects**, where it can be reopened into the Playground or deleted.

### Flow D: Cross-Module Exploration (`Dashboard`, `Physics & Math`, `Challenges`, `Docs & API`, `Settings`)
- **Dashboard**: View earned XP, streak days, completed labs, and launch any module.
- **Physics & Math**: Adjust launch velocity `v₀`, angle `θ`, and gravity (Moon/Mars/Earth) on a live SVG projectile trajectory plot.
- **Challenges**: Attempt constrained navigation challenges (`Zero-Collision Slalom`, `Dead-End Escape Matrix`, `High-Speed Heuristic Sprint`).
- **Docs & API / Settings**: Search `stem_robotics` SDK symbols and configure editor font size, default heuristic weight, and hardware bridge sync.
