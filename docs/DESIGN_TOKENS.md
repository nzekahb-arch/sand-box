# Color Tokens (60-30-10) & WCAG AA Contrast Table

## 1. 60-30-10 Palette Distribution

| Allocation | Role | Hex / Tokens |
| :--- | :--- | :--- |
| **60% Dominant Neutral** | Main canvas & primary interactive cards | `--color-surface` (`#F7F9FB`), `--color-surface-container-lowest` (`#FFFFFF`) |
| **30% Secondary Structural** | Persistent sidebars, toolbars, sub-headers, structural outlines | `--color-surface-container-low` (`#F2F4F6`), `--color-surface-container` (`#ECEEF0`), `--color-outline-variant` (`#C4C5D7`) |
| **10% Accent & Emphasis** | Primary run/submit CTAs, active nav pills, STEM formula accents | `--color-primary-container` (`#1D4ED8`), `--color-primary` (`#0037B0`), `--color-secondary` (`#712EDD`) |

## 2. WCAG AA Contrast Verification

Minimum WCAG 2.1 AA thresholds: **4.5:1** for normal text, **3.0:1** for large text / UI icons.

| Foreground | Background | Pairing Context | Contrast Ratio | WCAG AA Status |
| :--- | :--- | :--- | :--- | :--- |
| `#191C1E` (`on-surface`) | `#FFFFFF` (`surface-container-lowest`) | Primary card headings & body copy | **17.0:1** | Pass (AAA) |
| `#434655` (`on-surface-variant`) | `#F2F4F6` (`surface-container-low`) | Sidebar nav labels & descriptions | **8.7:1** | Pass (AAA) |
| `#525565` (`outline`) | `#F7F9FB` (`surface`) | Breadcrumbs & micro metadata labels | **7.1:1** | Pass (AAA) |
| `#FFFFFF` (`on-primary`) | `#1D4ED8` (`primary-container`) | `Run Code` button & active sidebar item | **6.7:1** | Pass (AA) |
| `#FFFFFF` (`on-secondary`) | `#712EDD` (`secondary`) | `Step (dt=0.1s)` STEM accent button | **6.5:1** | Pass (AA) |
| `#E2E8F0` (`slate-200`) | `#0F172A` (`slate-900`) | Python Code Editor & Terminal STDOUT | **14.3:1** | Pass (AAA) |
| `#14532D` (`emerald-900`) | `#DCFCE7` (`emerald-100`) | `LIVE SIMULATION` & passing badges | **9.8:1** | Pass (AAA) |
| `#93000A` (`on-error-container`) | `#FFDAD6` (`error-container`) | Execution fault & error badges | **7.9:1** | Pass (AAA) |
