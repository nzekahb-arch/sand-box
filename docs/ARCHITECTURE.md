# Architecture & 8pt Grid Specification

## 1. Layout & 8pt Spatial Rhythm

The desktop workspace follows a strict **8-point spatial rhythm** (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`) paired with a **4px micro-grid** for status pills, inline code tags, and icon offsets:

| Region | Dimension / Token | Role |
| :--- | :--- | :--- |
| Top Navigation Bar | `h-16` (`64px`) fixed | Brand identity, dynamic module breadcrumb, XP (`1,250 XP`) & Streak (`7 Days`) telemetry, profile badge |
| Left Persistent Sidebar | `w-60` (`240px`) fixed on `lg+` | Primary navigation (`Dashboard`, `Code Playground`, `Robotics Lab`, `Physics & Math`, `Challenges`, `My Projects`) + secondary (`Docs & API`, `Settings`) |
| Main Workspace Grid | `max-w-[1440px]`, `p-5 md:p-8` (`32px`), `gap-6` (`24px`) | 12-column responsive layout (`lg:col-span-4` Lesson/Grid guide + `lg:col-span-8` Code Editor & Telemetry) |
| Modular Card Padding | `p-4` (`16px`) / `p-6` (`24px`) | Level 2 white surfaces bounded by 1px `#C4C5D7` (`outline-variant`) structural borders |

On viewports below `lg` (`1024px`), the sidebar collapses into a slide-over drawer and the 12-column grid stacks vertically without horizontal overflow.

## 2. Application Architecture

```text
src/
├── App.tsx                     # Root state coordinator (active tab, lab state, XP, localStorage)
├── index.css                   # Tailwind v4 @theme tokens & base typography rules
├── types/sandbox.ts            # Shared TypeScript interfaces for labs, steps, and settings
├── data/labs.ts                # Curriculum presets (Lab 04, 05, 06), Challenges, API Reference
├── engine/
│   ├── astar.ts                # A* / Dijkstra / BFS solver, Euclidean/Manhattan metrics, pose headings
│   └── pythonSandbox.ts        # Client-side stem_robotics Python parser & diagnostic executor
└── components/
    ├── Header.tsx              # Fixed 64px top bar
    ├── Sidebar.tsx             # 240px persistent nav + mobile drawer
    ├── CodePlaygroundView.tsx  # Primary 12-col lab workspace
    ├── CodeEditor.tsx          # Line-numbered syntax-highlighted Python editor
    ├── PathfindingGrid.tsx     # Interactive 6x6 Cartesian SVG occupancy grid
    ├── TelemetryPanel.tsx      # Kinematics HUD + Waypoint Track + STDOUT terminal
    ├── FormulaModal.tsx        # Weighted A* & Euclidean formula reference dialog
    └── ...                     # Dashboard, Robotics Lab, Physics & Math, Challenges, Projects, Docs, Settings
```
