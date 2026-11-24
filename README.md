# Code & STEM Sandbox

An interactive browser-based Python & Robotics STEM learning environment featuring an editable `stem_robotics` Python workspace, real-time A* / Dijkstra / BFS grid pathfinding, kinematics & ballistics visualization, and live telemetry diagnostics.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4 (`@theme` tokens in `src/index.css`)
- **Icons**: `lucide-react`
- **Verification**: Playwright (`@playwright/test`)

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Git Workflow (Module 02)

All feature work is isolated on feature branches created from an up-to-date `main` branch (`feat/m02-ind-<name>`) using atomic Conventional Commits (`docs:`, `style:`, `feat:`, `fix:`, `chore:`).

## Documentation

- [Architecture & 8pt Grid Spec](./docs/ARCHITECTURE.md)
- [Color Tokens & WCAG AA Contrast Table](./docs/DESIGN_TOKENS.md)
- [Interactive Component States](./docs/COMPONENT_STATES.md)
- [Core User Flow Screens](./docs/USER_FLOWS.md)
