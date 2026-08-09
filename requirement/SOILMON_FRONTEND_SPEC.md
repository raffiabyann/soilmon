# SoilMon Frontend Specification

> **Status:** Initial Frontend Specification  
> **Purpose:** Source of truth for the SoilMon frontend implementation  
> **Current scope:** Monitoring dashboard only  
> **Important:** This document separates confirmed project requirements from assumptions and unknowns. Do not invent missing hardware, protocol, backend, or product requirements.

## 1. Project Context

**Project title:** Soilmon: IoT-Based Soil Monitoring System Untuk Pertanian Presisi Berkelanjutan

SoilMon is an IoT-based soil monitoring project for precision and sustainable agriculture.

The immediate frontend responsibility is to provide a clear monitoring interface for the SoilMon system.

The primary engineering responsibility in the wider project is the **gateway**. The frontend is being developed in parallel while the hardware and communication details are still being investigated.

The current gateway/node architecture is not yet fully specified.

## 2. Current Product Goal

The first frontend release should function primarily as a **monitoring dashboard**.

The dashboard should allow a user to quickly understand:

1. Whether the gateway is available/online.
2. The current status of the four SoilMon nodes.
3. Environmental telemetry available from the nodes.
4. Historical/environmental trends when the required data exists.
5. Important system conditions when a real alert mechanism exists.

The dashboard should be useful at a glance and should not pretend to expose data that the actual system cannot provide.

## 3. Confirmed Scope

### In scope

- Single primary monitoring dashboard.
- Gateway status.
- Four node monitoring cards.
- Environmental monitoring visualization.
- Light mode.
- Dark mode.
- Institutional/project branding.
- Desktop-first interface.
- Clean, professional monitoring-oriented UI.
- Dummy/static data during frontend development before hardware integration.

### Not currently in scope

Do **not** implement these unless a later requirement explicitly introduces them:

- Authentication.
- User accounts.
- User roles/permissions.
- Farmer accounts.
- Hardware-admin accounts.
- AI analytics/prediction.
- Automated recommendations.
- Gateway configuration.
- Node configuration.
- Remote gateway control.
- Remote valve/control operations.
- Device provisioning.
- OTA firmware management.
- Hardware setup workflows.
- Complex reporting/export systems.
- Maps/location tracking.
- Multi-project/multi-tenant management.
- Any feature invented solely because it is common in other IoT dashboards.

## 4. Important Project Boundary

The frontend must not define the hardware architecture.

The gateway and node communication details are still being investigated.

The SoilMon project differs from the previous MySalak project:

### MySalak

The previous project used an SX1302 concentrator-based gateway and OpenWrt/LuCI infrastructure, including networking, VPN/WireGuard, MQTT, and ChirpStack.

### SoilMon

The current understanding is that SoilMon uses an ESP32 with an SX1276/SX1278-based LoRa radio on the gateway side, with four nodes being developed by the Electrical Engineering team.

The exact communication architecture, packet handling, gateway software, and backend integration are **not yet confirmed**.

Therefore:

> Never copy the MySalak architecture into SoilMon by assumption.

The frontend must remain independent from these unknown implementation details.

## 5. Known vs Unknown Data

### Known / strongly expected

- There are four SoilMon nodes.
- Nodes are expected to send soil/environmental telemetry.
- The gateway receives data from nodes.
- The dashboard needs to expose gateway/node monitoring information.

### Currently unknown

- Exact node payload format.
- Exact telemetry fields.
- Exact sensor models.
- Sampling interval.
- Packet structure.
- Node addressing/identification format.
- Gateway-to-server protocol.
- Whether MQTT will be used.
- Whether REST API will be used.
- Whether WebSocket/SSE will be used.
- Database structure.
- Alert-generation mechanism.
- Exact gateway telemetry.
- Gateway hardware health metrics.
- Whether RSSI is available.
- Whether battery information is available.
- Whether pH is available.
- Whether temperature is available.
- Whether soil moisture is available.

### Rule

If a value is unknown, treat it as **mock/demo data**, not as a confirmed system requirement.

When the actual hardware specification becomes available, update the data model before implementing the real integration.

## 6. Dashboard Information Architecture

The primary dashboard should visually follow this hierarchy:

```text
SoilMon
│
├── Sidebar
│   ├── SoilMon identity
│   ├── Navigation placeholder / current dashboard
│   └── Compact gateway status
│
├── Main Header
│   ├── Dashboard title
│   ├── Monitoring subtitle
│   ├── Institutional/project logos
│   ├── Last sync
│   ├── Auto refresh state
│   └── Light/Dark theme toggle
│
├── Gateway / System Summary
├── Environmental Overview
├── Four Node Cards
│   ├── Node 1
│   ├── Node 2
│   ├── Node 3
│   └── Node 4
├── Optional/Conditional Supporting Sections
│   ├── Recent Alerts
│   └── System Information
└── Institutional Attribution
```

Supporting sections such as Recent Alerts and System Information are currently **provisional**. Keep the implementation modular so they can be removed or replaced after the real data contract is known.

## 7. Four Node Requirement

All four SoilMon nodes should be visible on the primary dashboard.

Do not hide the four nodes behind a separate page during the initial monitoring release.

The intended layout is a compact four-column desktop grid when the viewport allows it.

Each node card may visually contain fields such as:

- Node name/ID.
- Online/offline/warning state.
- Temperature.
- Soil moisture.
- pH.
- Battery.
- RSSI/signal.

However:

> These fields are visual placeholders until confirmed by the actual node payload.

The component must therefore be data-driven rather than hardcoded around a fixed set of telemetry fields.

## 8. Environmental Overview

The Environmental Overview is intended to be the primary visualization area.

Its conceptual purpose is:

> Show environmental/soil conditions and their trend across the monitoring period.

Potential metrics include:

- Temperature.
- Soil moisture.
- pH.

These are currently design assumptions based on the expected purpose of the project and existing SoilMon visual references.

The chart implementation must support changing the actual metrics later without rebuilding the entire dashboard.

Do not hardcode the current mock values as system truth.

## 9. KPI / Summary Cards

The visual references contain summary cards such as:

- Gateway Status.
- Data Received.
- Data Trend.
- System Uptime.

These should initially be treated as **design placeholders**.

### Data Received

Conceptually could represent the number of telemetry records/packets received during a period.

Actual definition is not confirmed.

### Data Trend

Conceptually could represent change in received data or another system metric.

Actual definition is not confirmed.

### System Uptime

Could represent gateway/application uptime if such telemetry is actually available.

Actual source and definition are not confirmed.

### Implementation rule

Do not build backend assumptions around these metrics.

Keep the cards/components easy to replace or remove once the actual data contract is known.

## 10. Gateway Status

Gateway status is an important monitoring element.

The UI should communicate at least a high-level state such as:

- Online.
- Offline.
- Warning / degraded.

The exact source of this status is not yet defined.

The interface should also allow for:

- Last sync / last received timestamp.
- Auto-refresh state.

Do not assume that gateway status means internet connectivity. The exact health semantics must be defined once the gateway/backend architecture is known.

Avoid duplicating the same large Gateway Status card in multiple places.

A compact gateway status can live in the sidebar while the main content uses the available space efficiently.

## 11. Alerts

The current visual reference contains a Recent Alerts section.

This is provisional.

Potential examples shown in the visual design include:

- Low signal.
- Low battery.
- pH warning.
- Moisture warning.

These are **examples only**, not confirmed alert rules.

Do not implement alert thresholds until the project defines:

- Which metrics generate alerts.
- Threshold values.
- Whether alerts are generated by the node, gateway, backend, or frontend.
- Severity levels.
- Persistence/history requirements.

The alert component should be reusable and data-driven.

## 12. System Information

The visual reference contains a System Information section.

Possible fields shown in the design include:

- Firmware version.
- Network status.
- Active nodes.
- Last sync protocol.
- Storage usage.

These are not confirmed requirements.

Keep this area modular and easy to remove.

Do not fabricate gateway firmware, storage, protocol, or network data as real system behavior.

## 13. Institutional Branding

The dashboard should preserve the project's institutional identity.

Current known branding includes:

- SoilMon.
- Universitas Multimedia Nusantara (UMN).
- FTI / Faculty of Engineering and Informatics branding.
- DEKATIF — Relentless Innovation.
- Hilirisasi.

The institutional logos should appear **once in the main header/branding area** rather than being duplicated in the sidebar.

The sidebar should remain focused on navigation and gateway context.

### Footer attribution

Preserve a subtle project attribution inspired by the existing SoilMon site:

> ENGINEERED FOR PRECISION BY  
> UNIVERSITAS MULTIMEDIA NUSANTARA & PT. IDE KREATIF TEKNOLOGI

This is institutional attribution, not a navigation footer.

Avoid unnecessary SaaS-style links such as Privacy Policy, Terms of Service, and Support unless explicitly required later.

## 14. Visual Direction

The visual direction is based on the approved SoilMon dashboard reference.

### General character

- Professional.
- Modern.
- Research/engineering oriented.
- Agricultural but not overly decorative.
- Clean.
- Information-dense but readable.
- Desktop-first.
- Production-oriented rather than concept-art oriented.

Avoid:

- Cyberpunk styling.
- Neon-heavy colors.
- Excessive gradients.
- Glassmorphism everywhere.
- 3D/AI-generated decorative icons.
- Random colorful illustrations.
- Marketing landing-page patterns.
- Excessive animations.
- Generic "AI dashboard" aesthetics.

## 15. Sidebar

The approved visual direction uses a **green sidebar**.

The sidebar should:

- Establish SoilMon's agricultural identity.
- Contain SoilMon branding.
- Contain the primary navigation/current dashboard context.
- Contain a compact gateway status area.
- Avoid duplicate institutional logos.

The green should be a controlled SoilMon/forest-style green, not neon green.

The sidebar should remain visually consistent between light and dark themes.

## 16. Header

The header should remain clean.

It may contain:

- Dashboard title/context.
- Institutional logos.
- Last sync.
- Auto-refresh status.
- Theme toggle.

Do not add:

- User avatar.
- Login/profile controls.
- Account menus.

Authentication is not currently in scope.

## 17. Theme System

Both **Light Mode** and **Dark Mode** are part of the visual direction.

The theme must be implemented as a proper design-token system rather than manually styling two unrelated pages.

### Light theme

Characteristics:

- Off-white/light neutral page background.
- White cards.
- Dark navy/near-black text.
- Soft borders.
- SoilMon green accent.
- Subtle agricultural/topographic decoration.

### Dark theme

Characteristics:

- Dark charcoal/navy background.
- Slightly lighter dark cards.
- Light text.
- Subtle borders.
- Same SoilMon green accent.
- Same information hierarchy.

### Theme rule

Status colors must remain semantically consistent:

- Green = healthy/online.
- Amber/yellow = warning.
- Red = critical/error.
- Blue = informational.

Do not redesign the dashboard structure when switching themes.

## 18. Background Decoration

A very subtle agricultural/topographic visual texture may be used.

Examples:

- Contour lines.
- Extremely faint leaf outlines.
- Very low-opacity agricultural pattern.

The decoration must remain subordinate to the data.

It must never interfere with charts, node values, alerts, or readability.

## 19. Iconography

Use a consistent icon library during implementation.

Preferred direction:

- Lucide-style outline icons or another single coherent icon system.

Do not mix:

- random icon libraries,
- emoji,
- 3D icons,
- filled cartoon icons,
- unrelated visual styles.

Example semantic mapping:

```text
Gateway       → radio/network icon
Temperature   → thermometer
Moisture      → droplet
pH            → flask/science icon
Battery       → battery
Signal        → signal bars
Alert         → warning triangle
History       → chart
Settings      → settings
```

The exact library can be decided during architecture setup.

## 20. Desktop Layout / Viewport Goal

The dashboard is **desktop-first**.

The target is a comfortable 16:9 desktop viewport, especially:

- 1920×1080.
- 1440×900.

The design should prioritize **at-a-glance monitoring**.

Avoid unnecessarily tall sections.

The primary monitoring information should fit into one desktop viewport when practical.

However:

> Do not sacrifice readability simply to eliminate every possible scrollbar.

If the actual browser viewport cannot fit every supporting section, the core monitoring information takes priority:

1. Gateway status.
2. Environmental overview.
3. Four nodes.
4. Other supporting information.

Responsive behavior should be graceful rather than forcing an artificial fixed height.

## 21. Responsive Behavior

Desktop is the primary target.

Still provide reasonable behavior for smaller screens.

Suggested behavior:

- Desktop: four node cards in one row.
- Medium desktop/tablet: two-column node grid.
- Mobile: one-column node stack.

Do not attempt to squeeze four full telemetry cards into an unusably narrow mobile viewport.

## 22. Data Architecture

The frontend should be **data-driven**.

Do not scatter telemetry values throughout JSX components.

Prefer a structure conceptually similar to:

```text
Dashboard
  ├── gateway
  ├── summary
  ├── environmentalSeries
  ├── nodes[]
  ├── alerts[]
  └── systemInfo
```

During initial development, use mock data.

The mock layer must be easy to replace with real API/MQTT/WebSocket data later.

Do not couple UI components directly to the eventual transport mechanism.

## 23. Hardware / Backend Integration Boundary

The frontend should not directly assume:

- MQTT.
- REST.
- WebSocket.
- LoRaWAN.
- ChirpStack.
- WireGuard.
- OpenWrt.
- SX1302 concentrator architecture.

Those technologies were relevant to MySalak, but they are **not automatically applicable to SoilMon**.

The frontend should consume a clean application-level data model.

The eventual transport layer can adapt the real gateway/backend data into that model.

Conceptually:

```text
Real Gateway
     ↓
Transport / Backend
     ↓
Frontend Data Adapter
     ↓
SoilMon UI Components
```

## 24. Mock Data Rules

Mock data is allowed and encouraged during frontend development.

However:

- Clearly label mock data in development documentation.
- Do not claim mock values are real.
- Keep the mock structure close to a realistic future API shape.
- Do not invent complicated backend behavior merely to make the UI look complete.
- Keep unknown fields optional where appropriate.

Example:

```json
{
  "id": "node-01",
  "name": "Node 01",
  "status": "online",
  "telemetry": {
    "temperature": 28.5,
    "moisture": 65,
    "ph": 6.5
  }
}
```

This is an example development model only. The final telemetry schema must follow the actual SoilMon hardware specification.

## 25. Implementation Principles

### Reusability

Create reusable components such as:

- `NodeCard`
- `GatewayStatus`
- `MetricCard`
- `EnvironmentalChart`
- `AlertList`
- `SystemInfo`
- `ThemeToggle`

Do not create four separate hardcoded node components.

### Separation of concerns

Keep UI components, mock data, data transformation, API/service code, and theme configuration separate.

### Maintainability

A future change to the node payload should not require rewriting the entire dashboard.

### Explicit uncertainty

If a requirement is unknown, leave a clear TODO or configurable abstraction.

Do not silently invent behavior.

## 26. Visual Reference Rule

The approved SoilMon visual references are the **appearance reference**, not the source of backend truth.

Use the references to reproduce:

- layout direction,
- visual hierarchy,
- spacing philosophy,
- colors,
- branding,
- theme behavior,
- card treatment,
- typography direction,
- icon style.

Do not infer backend functionality solely from a screenshot.

If the screenshot shows a metric that has not been confirmed by the project specification, treat it as a placeholder.

## 27. Change Management

This specification is intentionally designed to evolve.

When new information becomes available from:

- Bu Nabila.
- The Electrical Engineering team.
- Hardware testing.
- Gateway implementation.
- Node firmware.
- Backend/API design.
- Field deployment in Tuban.

Update this document before making major architectural changes.

When a new requirement conflicts with this document, the newer **confirmed project requirement** takes priority.

## 28. Current Unknowns / Waiting for Hardware & Meeting

The following should remain open until confirmed:

- Exact gateway hardware setup.
- SX1276/SX1278 gateway operating model.
- How the gateway listens to the four nodes.
- Whether reception is sequential, concurrent, or handled by a specific software mechanism.
- Exact node communication protocol.
- Exact node payload.
- Exact sensor list.
- Telemetry sampling interval.
- Gateway-to-server communication.
- Backend architecture.
- Data persistence/database.
- MQTT/API/WebSocket decision.
- Alert rules.
- Authentication requirements.
- Whether the dashboard needs control functions.
- Whether AI analytics will eventually be used.
- Deployment environment.

## 29. Agent Guardrails

Any coding agent working on SoilMon must follow these rules:

1. Read this specification before changing code.
2. Inspect the existing repository before deciding architecture.
3. Do not invent hardware protocols.
4. Do not copy MySalak architecture into SoilMon without explicit confirmation.
5. Do not add authentication unless explicitly requested.
6. Do not add AI analytics unless explicitly requested.
7. Do not add gateway/node control unless explicitly requested.
8. Do not create additional pages merely because they are common in IoT dashboards.
9. Do not treat mock telemetry as confirmed telemetry.
10. Keep the four nodes visible in the primary monitoring dashboard.
11. Preserve the approved SoilMon visual identity.
12. Use a consistent icon system.
13. Support both light and dark themes.
14. Prefer reusable components over duplicated markup.
15. Keep data sources replaceable.
16. If an important requirement is missing, stop and ask rather than guessing.
17. Make the smallest change necessary to satisfy a confirmed requirement.
18. Do not rewrite working project architecture without first explaining why.
19. Do not introduce unnecessary dependencies.
20. Before large changes, explain the intended architecture and wait for approval when the change could materially affect the project structure.

## 30. Current Definition of Done — Frontend MVP

The initial frontend MVP is considered successful when:

- The SoilMon dashboard renders cleanly on desktop.
- Light mode works.
- Dark mode works.
- The green sidebar is implemented.
- Institutional branding is represented appropriately.
- Gateway status is visible.
- Four node cards are visible.
- Environmental monitoring is visualized.
- Mock data is separated from UI components.
- No authentication is required.
- No AI analytics are required.
- No hardware control is required.
- No unconfirmed gateway protocol is hardcoded into the UI.
- The UI is structured so real gateway data can be integrated later without a major redesign.

## 31. Next Engineering Step

Before writing substantial frontend code:

1. Inspect the existing repository.
2. Identify the current stack and dependencies.
3. Identify whether an existing frontend should be extended or replaced.
4. Compare the repository against this specification.
5. Produce an implementation plan.
6. Confirm the plan before large-scale implementation.

**Do not immediately generate the entire application from scratch without inspecting the repository first.**

## Final Principle

> **The UI should adapt to the real SoilMon system — the real SoilMon system should not be forced to match assumptions made by the UI.**

Build the frontend now with realistic mock data, but keep the architecture ready for the real gateway, node, and telemetry contract once those details are confirmed.

## 32. Visual Implementation Contract

> **Purpose:** Make the approved SoilMon dashboard design (`requirement/soilmon-concept.png`) reproducible from text alone by a coding agent that cannot inspect the image.
> **Authority:** The approved visual reference is the source of truth for **appearance**. The specification is the source of truth for **behavior and requirements**. Where this contract and the reference image disagree, the **image wins** and this contract must be corrected.
> **Do NOT** redesign, simplify, modernize, optimize, or reinterpret the approved layout. Do NOT remove elements because they are "not functionally necessary." Do NOT add elements because they are common in modern dashboards.
> **Value convention:** Numeric values below are implementation defaults/guidance derived from the approved design and specification. Treat them as the intended baseline unless the reference image dictates otherwise.

### 32.1 Overall Desktop Canvas / Layout

- Two-region layout: a **full-height, fixed left Sidebar** and a **fluid Main Column** to its right. No top bar spans above the sidebar; the sidebar reaches the full viewport height.
- Main Column contains, top to bottom, in this exact order (matches §6 and the reference):
  1. Header
  2. KPI / Summary row (four cards)
  3. Environmental Overview
  4. Four Node Cards (one horizontal row)
  5. Recent Alerts + System Information
  6. Institutional Attribution (footer)
- Main Column content max-width ~1600px, horizontal page padding ~32px, vertical spacing between major sections ~24px.
- Single scroll column. No inner scroll panes, no forced viewport locking (§20).

### 32.2 Sidebar

- **Position:** left, fixed, **full viewport height**. Main Column is offset by the sidebar width.
- **Width:** ~248px at ≥1440px.
- **Color:** controlled SoilMon **forest green**, solid fill, **identical in light and dark themes** (§15). Not neon, no gradient.
- **Structure (top → bottom):**
  1. **SoilMon branding** at the top (logo/wordmark lockup).
  2. **Navigation list**, in this exact order:
     - Dashboard
     - Data History
     - Alerts
     - Reports
     - Settings

     "Dashboard" is the active item. In the monitoring MVP these are visual navigation items reflecting the approved design; only the Dashboard view is implemented. Non-active items must remain present and visible — **do not remove them** because their pages are not built yet.
  3. Flexible spacer.
  4. **Compact status block** near the bottom, containing three lines/indicators:
     - **Gateway Online** (status dot + label)
     - **Last Sync** (timestamp)
     - **Auto Refresh** (state indicator)
  5. **Subtle decorative agricultural / leaf illustration** in the **lower sidebar area**, low-opacity, behind or beneath the status block, never reducing legibility of the status text.
- Sidebar text/icons are light-on-green for contrast in both themes.
- **No institutional logos** in the sidebar (§13). **No user/profile/account UI** (§16).

### 32.3 Header

- Full width of the Main Column, single horizontal band.
- **Height:** ~72–88px, content vertically centered.
- **Structure (left → right):**
  - **Left group:** Dashboard title with a smaller monitoring subtitle beneath it.
  - **Right group (in order):** four institutional logos → date/time → Auto Refresh control → Light/Dark theme toggle. (Detail in §32.4 and §32.6.)
- Header is a title band (not a card); a soft bottom border or spacing separates it from the KPI row below.
- **DO NOT** place avatar, login, profile, account, or notification-account UI (§16).

### 32.4 Institutional Logos — Placement & Grouping

- **Exactly four** institutional logos appear **once**, in the **Header right area** (§13). Never in the sidebar, never in the footer.
- **Exact order (left → right):**
  1. **Hilirisasi**
  2. **UMN**
  3. **FTI**
  4. **DEKATIF**
- **FTI must NOT be omitted.** The **FTI logo asset will be provided later**; until it arrives, reserve its slot in the correct position and treat it **exactly like the other three** institutional logos (same rendered height, alignment, spacing, and treatment). Do not skip, reorder, or substitute the slot.
- Displayed as a single inline horizontal group, uniform rendered height ~28–36px, even gaps, with a subtle divider or spacing separating the logo group from the date/time, Auto Refresh, and theme controls.
- Logos are decorative brand marks — not buttons or links (unless a later requirement adds links).
- Mixed source formats (`hilirasi.jpg`, `umn.jpg`, FTI [pending], `dekatif.png`) must be normalized to consistent rendered height and vertical alignment.

### 32.5 Gateway Status Placement

- **Two variants, two locations, never duplicated as the same large card:**
  - **Compact variant** → Sidebar lower status block (§32.2): Gateway Online + Last Sync + Auto Refresh.
  - **Summary variant** → first KPI card, "Gateway Status" (§32.7).
- States use semantic status color: green=online, amber=warning/degraded, red=offline (§10, §17). Conveyed by **color + text + icon**, never color alone.

### 32.6 Date/Time / Auto Refresh / Theme Toggle

- All live in the **Header right group**, ordered after the logos: **date/time → Auto Refresh → theme toggle** (theme toggle right-most).
- **Date/time:** small text (mock value).
- **Auto Refresh (header):** compact control/indicator showing on/off state. (The sidebar also shows Auto Refresh as part of its status block per §32.2; both are present per the approved design — do not remove either.)
- **Theme toggle:** single icon button (sun/moon), right-most. No dropdown menu.

### 32.7 KPI / Summary Card Row

- **Exactly four** KPI cards in a single horizontal row directly beneath the Header, equal width.
- **Exact order and labels:**
  1. **Gateway Status**
  2. **Data Received (Today)**
  3. **Data Trend (24 Hours)**
  4. **System Uptime**
- Each card: leading icon, metric label (small, muted), primary value (large), optional secondary/trend line. Uniform height.
- Grid: 4 columns at ≥1440px, even gutters ~24px.
- All values are **placeholders** (§9, §19).

### 32.8 Environmental Overview / Chart

- Full-width card **directly below the KPI row**, spanning the Main Column content width.
- **Plot-area height:** ~300–360px, moderate to preserve at-a-glance layout (§20).
- Contains: card title ("Environmental Overview"), an optional metric/legend selector, and one line/area chart.
- Plots configurable series (temperature, moisture, pH as **placeholders**, §8); metric-agnostic so series can change later without layout change.
- Primary series uses accent green; additional series use a restrained palette consistent with status semantics (info=blue). No neon.

### 32.9 Four-Node Card Grid

- **Exactly four** equal-width Node Cards in **one horizontal row** at ≥1440px (§7, §21), below the Environmental Overview.
- **Card proportions:** portrait/tall rectangles, equal height across the row, gutters matching the KPI row (~24px).
- **Card internal structure (top → bottom):**
  1. Header: node name/ID (left) + status badge (right).
  2. Telemetry list: rows of `icon + label + value` for whatever fields exist (temperature, moisture, pH, battery, RSSI as **placeholders**).
  3. Optional footer line (e.g., last-seen) if present in data.
- Card is **data-driven**: renders the telemetry fields present in the data object; must not hardcode a fixed field set (§7, §25).
- Responsiveness: 4-col → 2-col → 1-col per §32.18. The four nodes are **never** hidden behind another page.

### 32.10 Recent Alerts & System Information

- Placed below the node grid as a **two-column supporting row**: **Recent Alerts** (left, wider) + **System Information** (right, narrower), each a card.
- **Recent Alerts:** vertical list of rows (severity icon/color + message + optional timestamp). Data-driven; example entries (low signal, low battery, pH/moisture warning) are **placeholders only** (§11).
- **System Information:** compact label/value list (firmware, network, active nodes, last-sync protocol, storage) — all **placeholders** (§12).
- Both sections are **modular and removable** without disturbing the layout above (§6, §12), but are **present in the approved design** and must be included in the MVP.

### 32.11 Footer Attribution

- Subtle text block at the very bottom of the Main Column, small muted type:
  > ENGINEERED FOR PRECISION BY
  > UNIVERSITAS MULTIMEDIA NUSANTARA & PT. IDE KREATIF TEKNOLOGI
- **Institutional attribution, not navigation** (§13). No Privacy Policy / Terms / Support links. No logos repeated here.

### 32.12 Background Decoration

- Two decorative treatments, both very subtle and strictly behind content:
  - **Main Column:** low-opacity agricultural/topographic texture (faint contour lines or leaf outlines), opacity ≤ ~5%; never overlaps chart lines, values, badges, or reduces readability (§18).
  - **Sidebar lower area:** the subtle leaf/agricultural illustration described in §32.2; sits on the solid green fill, low-opacity, never obscuring the status block text.

### 32.13 Radii, Borders, Shadows, Spacing Philosophy

- **Border radius:** consistent, moderate — cards ~12px, inner elements/badges ~8px. No fully-pill everything, no sharp 0px corners.
- **Borders:** soft 1px hairline on cards using the theme border token.
- **Shadows:** subtle, low-elevation only. **No heavy shadows, glow, or glassmorphism** (§14).
- **Spacing:** consistent scale (multiples of 4px); information-dense yet readable; card padding ~20–24px.

### 32.14 Typography Hierarchy

- Single sans-serif family, coherent scale (default to a clean system/geometric sans if the image font is unknown):
  - Dashboard title: large, semibold.
  - Section/card titles: medium, semibold.
  - KPI primary value: large, bold.
  - Labels/metadata (date/time, units, muted captions): small, muted token.
  - Body/telemetry values: regular.
- Consistent line-height; ≤ ~4 distinct sizes; tabular alignment where values stack.

### 32.15 Iconography Rules

- **One** outline icon system, **Lucide preferred** (§19); uniform stroke width and size within a context.
- Fixed semantic mapping (§19): gateway=radio/network, temperature=thermometer, moisture=droplet, pH=flask, battery=battery, signal=signal bars, alert=warning triangle, history=chart, settings=settings.
- **DO NOT** mix icon libraries, use emoji, filled/cartoon icons, or 3D icons.

### 32.16 Light Mode Appearance (§17)

- Page background: off-white / light neutral.
- Cards: white surfaces, soft hairline borders.
- Text: dark navy / near-black primary; muted grey secondary.
- Accent: SoilMon green. Sidebar: forest green (unchanged from dark).
- Subtle topographic decoration per §32.12.

### 32.17 Dark Mode Counterpart (§17)

- Page background: dark charcoal / navy.
- Cards: slightly lighter dark surfaces, subtle borders.
- Text: light primary, muted light-grey secondary.
- Accent: **same** SoilMon green. Sidebar: **same** forest green as light mode.
- **Identical layout, hierarchy, and component positions** — only token values change. Status colors remain semantically identical (green/amber/red/blue). Theme switching changes **visual tokens only**.

### 32.18 Desktop Viewport Behavior — 1920×1080 & 1440×900

- **1920×1080:** full layout — sidebar ~248px; KPI 4-across; nodes 4-across; environmental chart full width; core monitoring (gateway → environmental → four nodes) visible with minimal scroll (§20).
- **1440×900:** same structure; content max-width and paddings tighten; KPI and nodes remain 4-across; moderate vertical scroll acceptable — **do not** compress heights artificially to force single-screen fit (§20).
- **Breakpoints (§21):** ≥~1280px 4-col nodes → ~768–1279px 2-col → <768px 1-col stack; sidebar may collapse to a narrow/hidden state on small screens.
- Priority on constrained height: Gateway status → Environmental overview → Four nodes → supporting sections.

### 32.19 Purely Visual Placeholders (no confirmed data)

Appearance-only placeholders, not real system behavior (§5, §9, §11, §12, §19, §24):

- All KPI values (Gateway Status, Data Received (Today), Data Trend (24 Hours), System Uptime).
- All node telemetry values/field set (temperature, moisture, pH, battery, RSSI) and node online/warning/offline states.
- Environmental chart series and data points.
- All alert entries and any implied thresholds.
- All System Information fields (firmware, network, active nodes, protocol, storage).
- Date/time, Last Sync, and Auto Refresh state.

These render from the mock data layer and must be trivially replaceable (§22–§24).

### 32.20 DO NOT CHANGE (Layout Preservation Rules)

An AI coding agent implementing this design **must not**:

1. Reorder the Main Column sections defined in §32.1 / §6.
2. Move institutional logos out of the Header, or duplicate them in sidebar or footer.
3. Omit, reorder, or substitute any of the four header logos — order is **Hilirisasi → UMN → FTI → DEKATIF**; the FTI slot is reserved even before its asset is delivered.
4. Remove or reorder sidebar navigation items — order is **Dashboard → Data History → Alerts → Reports → Settings**; keep all five even though only Dashboard is implemented in MVP.
5. Remove the compact sidebar status block (Gateway Online / Last Sync / Auto Refresh) or the sidebar leaf decoration.
6. Add a top bar above the sidebar, or make the sidebar non-full-height.
7. Change the sidebar color away from controlled forest green, or theme it differently between light and dark.
8. Convert the single-view dashboard into multiple pages/routes, or hide the four nodes behind another page.
9. Replace the compact sidebar gateway status with the large KPI card (or vice versa), or show two large gateway cards.
10. Add user/profile/avatar/login/account/notification-account UI to the header.
11. Add gateway/node controls, configuration, AI analytics, or recommendations.
12. Change the number of KPI cards (four) or Node cards (four), or alter their labels/order.
13. Introduce heavy shadows, glassmorphism, neon, gradients, excessive animation, or a second icon library.
14. Alter status color semantics (green/amber/red/blue).
15. Redesign the dashboard structure when switching themes (tokens only change).
16. Let background/sidebar decoration overlap or reduce readability of data or status text.
17. Remove or relocate the footer attribution, or turn it into a nav/links footer.
18. Add Privacy Policy / Terms / Support footer links.
19. Remove Recent Alerts or System Information from the MVP (they are in the approved design).
20. Restructure the layout to eliminate every scrollbar at the cost of readability (§20).

> **Guiding rule (restates §26):** the reference image governs *appearance*; the spec governs *behavior and data*. This contract reproduces the approved appearance — it does not reinterpret it.
