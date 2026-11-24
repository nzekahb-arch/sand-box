# Interactive Component States (Google Stitch Specification)

All interactive controls communicate state changes via **tonal surface shifts, 1px border transitions, and explicit focus rings** without fuzzy drop shadows.

## 1. Primary Action Button (`Run Code`)
- **Default**: Background `#1D4ED8` (`primary-container`), text `#FFFFFF`, 8px radius (`rounded-lg`), `36px` toolbar alignment.
- **Hover**: Background shifts to `#0037B0` (`primary`).
- **Active / Pressed**: `active:scale-95` subtle press feedback with `#0037B0` fill.
- **Focus-Visible**: 2px solid focus ring (`#1D4ED8`) with 2px offset (`focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2`).
- **Disabled / Running**: Background `#1D4ED8` at reduced saturation (`disabled:bg-slate-300 disabled:text-slate-700` or pulsing indicator while active execution runs), `cursor-not-allowed`.

## 2. Secondary / Outline Control (`Reset`, `Save`, `Restart Sim`)
- **Default**: Background `#F2F4F6` / `#FFFFFF`, text `#191C1E`, 1px solid `#C4C5D7` (`outline-variant/60`).
- **Hover**: Background transitions to `#ECEEF0` (`surface-container`).
- **Active / Pressed**: Slight background compression (`#E6E8EA`).
- **Focus-Visible**: 2px `#1D4ED8` outline ring with 2px offset.
- **Disabled**: Text `#434655`, muted border, `cursor-not-allowed`.

## 3. STEM Accent Button (`Step (dt=0.1s)`)
- **Default**: Background `#712EDD` (`secondary`), text `#FFFFFF`.
- **Hover**: Background transitions to `#8B4EF7` (`secondary-container`).
- **Active / Pressed**: `#5B00C5` (`on-secondary-fixed-variant`) emphasis.
- **Focus-Visible**: 2px `#712EDD` focus ring with 2px offset.
- **Disabled**: Background `#E2E8F0` (`slate-200`), text `#475569` (`slate-600`) for >= 4.5:1 contrast when simulation has faulted or halted.

## 4. Sidebar Navigation Item (`Dashboard`, `Code Playground`, etc.)
- **Default**: Transparent fill, text `#434655` (`on-surface-variant`), 18px icon.
- **Hover**: Background `#E6E8EA` (`surface-container-high`), text `#191C1E`.
- **Active / Current Page (`aria-current="page"`)**: Background `#1D4ED8` (`primary-container`), text `#FFFFFF`, Semi-Bold weight.
- **Focus-Visible**: 2px `#1D4ED8` inset/offset ring.
- **Disabled**: N/A (all 8 routes remain interactive across desktop and mobile drawers).

## 5. Interactive 2D Grid Occupancy Cell (`PathfindingGrid`)
- **Default**: `#F8FAFC` cell fill with `#E2E8F0` 1.2px grid stroke; hazard blocks in `#334155`.
- **Hover**: Translucent `#1D4ED8` (`8%` opacity) tint + live `(x, y)` coordinate readout in header.
- **Active / Click**: Toggles hazard block in `#334155` and synchronizes `obstacles = [...]` in Python editor.
- **Focus-Visible**: Keyboard-accessible `<rect>` / cell ring highlight.
- **Disabled (Origin / Goal Cells)**: Locked cursor (`cursor-not-allowed`) preserving `ROVER A` and `GOAL B` integrity.
