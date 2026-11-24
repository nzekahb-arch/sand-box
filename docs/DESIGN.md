---
name: STEM Sandbox
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#712edd'
  on-secondary: '#ffffff'
  secondary-container: '#8b4ef7'
  on-secondary-container: '#fffbff'
  tertiary: '#3d445a'
  on-tertiary: '#ffffff'
  tertiary-container: '#545c72'
  on-tertiary-container: '#cdd5ef'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#ebddff'
  secondary-fixed-dim: '#d3bbff'
  on-secondary-fixed: '#250059'
  on-secondary-fixed-variant: '#5b00c5'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system targets students, educators, and technical learners engaging in interactive computer science and STEM exploration. The aesthetic balances the precision of an IDE with the approachability of a contemporary learning suite. It communicates clarity, rigor, intellectual focus, and structural order.

Drawing from modern technical minimalism and structured SaaS utility, the interface prioritizes low cognitive friction, crisp information density, and functional hierarchy. Visual noise is minimized to keep attention centered on code, dynamic output consoles, and instructional scaffolding. Tactile gimmicks are discarded in favor of architectural borders, clear surface tiers, and explicit state signaling.

## Colors
The palette enforces a strict 60-30-10 distribution to maintain discipline across multi-pane desktop layouts:

- **Dominant Neutral (60%)**: `#F8FAFC` anchors the expansive main workspace canvas, complemented by `#FFFFFF` for primary cards, interactive panels, and focus modules.
- **Secondary Structural (30%)**: `#F1F5F9` anchors persistent toolbars and navigation panels; `#E2E8F0` defines structural sub-headers, code-adjacent sidebars, and specialized code editor backgrounds; crisp `#94A3B8` lines delineate panel edges and tool trays.
- **Accent & High-Emphasis (10%)**: `#1D4ED8` commands primary user actions, run buttons, active module indicators, and selection rings (paired exclusively with `#FFFFFF` text). `#6D28D9` highlights specialized STEM insights, mathematical notations, and secondary interactive milestones.
- **Text & Metadata**: `#0F172A` delivers high-contrast readability for headers, code text, and primary labels. `#334155` handles documentation copy, meta counters, and secondary file paths.
- **Status & Diagnostic Signaling**:
  - Success: `#DCFCE7` surface with `#14532D` text/iconography for passing tests and successful builds.
  - Warning: `#FEF3C7` surface with `#78350F` text/iconography for runtime bottlenecks and memory limits.
  - Error: `#FEE2E2` surface with `#7F1D1D` text/iconography for syntax errors, break states, and terminal exceptions.

## Typography
The system employs `Inter` for layout UI, instructions, and standard text hierarchies, pairing it with `JetBrains Mono` for code blocks, terminal outputs, mathematical values, and structural line counters. 

Hierarchy is established through weight shifts (Medium to Semi-Bold) and size steps rather than dramatic scale jumps, ensuring compact density appropriate for split-screen workspaces. In code execution contexts, `JetBrains Mono` maintains strict proportional column alignment. Always enable tabular figures for counters, timers, and telemetry metrics.

## Layout & Spacing
Built desktop-first, the layout relies on a strict 8-point spatial rhythm (8px, 16px, 24px, 32px, 48px, 64px) complemented by a 4px micro-grid reserved for tags, compact inputs, status dots, and icon offsets.

The primary desktop environment uses a multi-pane split layout:
- Left persistent sidebar (240px - 280px fixed width).
- Central editor and sandbox area (fluid column expansion, 16px internal gutter).
- Right collateral pane for live preview, step-by-step instructions, or runtime diagnostics (320px - 440px or 50% split).

On smaller viewports, panes convert from horizontal splits into tabbed full-width containers. Standard padding inside modular panels adheres strictly to `space-md` (16px), while grouped tool headers and toolbar item clusters collapse to `space-sm` (8px). Outer borders do not float; they snap edge-to-edge across panels to eliminate dead space.

## Elevation & Depth
This design system rejects heavy blur drops, gradient glows, and skeuomorphic elevations. Depth is achieved purely through **structural borders and tonal stepping**:

- **Ground Level (Canvas)**: `#F8FAFC` forms the base desktop frame.
- **Level 1 (Structural Navigation)**: `#F1F5F9` panels sit on the base, bounded by a 1px solid border (`#94A3B8`).
- **Level 2 (Interactive Work Surfaces)**: `#FFFFFF` card layers, modal trays, and active tabs sit above panels with an identical 1px solid outline (`#94A3B8`).
- **Level 3 (Overlays, Modals, & Menus)**: Pure `#FFFFFF` surfaces bounded by a 1px solid `#94A3B8` border and accompanied by a functional, non-diffuse ambient drop: `0px 4px 12px rgba(15, 23, 42, 0.08)`.

No fuzzy drop-shadows are used to indicate interactive states; hover and selection feedback is communicated entirely by border color changes (`#1D4ED8`) or subtle background fills (`#F1F5F9`).

## Shapes
A controlled corner radius of 8px (`roundedness: 2`) is maintained across cards, panels, inputs, and buttons, generating a modern, professional, but human-centered software interface.

Micro-elements (badges, status chips, and code inline tags) leverage a tighter 4px radius (`rounded-sm`) to prevent rounded corners from encroaching on monospaced character bounds. Modal sheets, active split-panes, and inner editor viewports preserve the 8px corner language internally while outer parent layout frames remain flush (0px) to screen edges.

## Components

### Buttons
- **Primary**: Background `#1D4ED8`, text `#FFFFFF`, 8px radius, height 36px (desktop toolbar standard). Hover: `#1E40AF`. Active: `#1E3A8A`. Focus ring: 2px offset with `#1D4ED8`.
- **Secondary / Outline**: Background `#FFFFFF`, text `#0F172A`, 1px solid `#94A3B8`. Hover: `#F1F5F9` background.
- **STEM Accent**: Background `#6D28D9`, text `#FFFFFF`. Reserved for formula evaluations, AI hint triggers, and math visualizers.
- **Icon / Utility**: Transparent background, text `#334155`, 1px solid transparent. Hover: `#E2E8F0` background, `#0F172A` text.

### Chips & Status Badges
- **General**: Height 22px, 4px border-radius, font `JetBrains Mono` 11px / Medium.
- **Success**: Background `#DCFCE7`, text `#14532D`, 1px solid transparent.
- **Warning**: Background `#FEF3C7`, text `#78350F`, 1px solid transparent.
- **Error**: Background `#FEE2E2`, text `#7F1D1D`, 1px solid transparent.
- **Language / Syntax Chip**: Background `#F1F5F9`, text `#334155`, 1px solid `#94A3B8`.

### Input Fields & Controls
- **Text Inputs**: Height 36px, background `#FFFFFF`, border 1px solid `#94A3B8`, text `#0F172A`, placeholder `#94A3B8`. Active/Focus: border `#1D4ED8`, shadow ring `0 0 0 1px #1D4ED8`.
- **Checkboxes & Radios**: 16x16px, border 1px solid `#94A3B8`, 4px radius (checkbox) / circular (radio). Checked state: `#1D4ED8` background with `#FFFFFF` check/dot glyph.

### Cards & Panels
- **Standard Card**: Background `#FFFFFF`, 1px solid `#94A3B8`, 8px border-radius, padding `space-md` (16px).
- **Collapsible Section Header**: Background `#E2E8F0`, padding `8px 16px`, typography `Inter` 13px / Semi-Bold, text `#0F172A`.

### Code Editor & Terminal Consoles
- **Editor Frame**: Background `#E2E8F0` header tab strip with `#FFFFFF` active tab. Code workspace `#FFFFFF` (or light gray neutral), border 1px solid `#94A3B8`. Line gutter numbers in `#94A3B8`.
- **Output Terminal**: Background `#F8FAFC`, top border 1px solid `#94A3B8`, text `#0F172A`, monospace font, padding `12px 16px`. Status indicator dot fixed in upper right.