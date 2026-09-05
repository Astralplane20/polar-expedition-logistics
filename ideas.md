# Polar Expedition Logistics — Design Direction

## Three candidate directions

### Theme Name: Polar Night Command
Very dark operational interface with restrained cyan mapping and safety-orange status signals; designed for focus, urgency, and high-density situational awareness.
Probability: 0.07

### Theme Name: Frosted Field Manual
Light archival interface with paper-white surfaces, graphite typography, blue ice annotations, and orange tab markers; designed for clarity and field-document confidence.
Probability: 0.04

### Theme Name: Signal in the Snow
High-contrast black-and-white expedition system with bold orange callouts and oversized route lines; designed to make critical exceptions impossible to miss.
Probability: 0.02

## Chosen approach: Polar Night Command

### Design Movement
Contemporary mission-control industrialism, borrowing from aviation cockpits, polar cartography, and high-end operational software rather than consumer SaaS dashboards.

### Core Principles
1. The interface should privilege operational truth: readiness, exposure, and exceptions appear before secondary detail.
2. Density is organized through strong alignment, thin rules, deliberate spacing, and clear hierarchy—not through endless cards.
3. Warm safety orange is reserved for actions, warnings, and movement; icy cyan is reserved for geography, telemetry, and confirmed state.
4. The system should feel usable with gloves and low visibility: large hit areas, sharp labels, and obvious interaction states.

### Color Philosophy
The foundation is polar-night navy and carbon, which makes the interface feel like a field console rather than a marketing site. Ice cyan provides spatial and telemetry cues, while safety orange is an ownable, high-visibility signal for exceptions and action. Pale blue-gray text keeps long operational reading comfortable.

### Layout Paradigm
A persistent left command rail anchors the system. The main canvas uses an asymmetric operational layout: a wide route/map surface, a narrow incident and readiness column, and lower horizontal bands for inventory and asset movement. The page should feel like a live wall console, not a centered collection of panels.

### Signature Elements
1. Hairline coordinate rules with small monospace labels.
2. A compact readiness ring and route line motif repeated across map, assets, and inventory.
3. Soft grain and frost-blue ambient light used sparingly behind dark surfaces.

### Interaction Philosophy
Interactions should feel like adjusting a mission instrument: subtle, immediate, and reversible. Tabs change the operational layer without navigation dead ends. Buttons announce what they will do, and mock actions update visible state so the prototype feels alive.

### Animation
Use short 160–240ms ease-out transitions for hover, selection, and tab changes. Stagger the first dashboard reveal by 40ms across the hero metrics. Keep map telemetry gently pulsing, but respect reduced-motion preferences. Do not animate core layout dimensions.

### Typography System
Use Space Grotesk for display and section headings, with IBM Plex Mono for coordinates, timestamps, statuses, and quantities. Body copy uses Space Grotesk at a comfortable 14–15px. Headings should be compact, slightly tracked out, and never overly rounded.

### Brand Essence
Northstar Ops is the expedition command layer for teams moving people and critical supplies through extreme environments. It is calm, precise, and alert.

### Brand Voice
Headlines are brief and decisive. CTAs describe the operational action. Microcopy says what is happening and what needs attention without hype.
Example lines: “East corridor holds. Fuel margin is tightening.” “Open the route picture.”

### Wordmark & Logo
Use the generated four-point north-star mark as the symbol. Pair it with a custom-feeling uppercase wordmark: NORTHSTAR / OPS, with the slash acting as a visual route marker.

### Signature Brand Color
Safety orange `#F27A3D`, used sparingly as the system’s unmistakable action and exception color.

## Prototype information architecture

| Layer | Prototype behavior |
|---|---|
| Overview | Readiness score, active route map, resource burn, alerts, and latest movement log |
| Routes | Tabbed route view with named waypoints and current vehicle movement |
| Inventory | Fuel, provisions, medicines, and shelter stock with status thresholds |
| Assets | Vehicle and equipment cards with telemetry and service status |
| People | Expedition team count and duty status; lightweight preview for future directory |
| Reports | Placeholder interaction that surfaces a toast explaining the next phase |

The first delivery focuses on Overview while making Routes, Inventory, Assets, People, and Reports visibly navigable within the single-page prototype.

## Style Decisions

The opening state must read as an operational condition before it reads as a greeting: corridor status, fuel margin, weather window, sync time, and readiness take priority.

The interface now treats cyan as confirmed telemetry/geography, orange as action or exception, and pale blue-gray as the neutral default. Secondary hues are muted so the safety-orange signal remains ownable.

Coordinate hairlines, compact mono annotations, route-line geometry, and the `// OPS` panel stamp are treated as recurring grammar across the whole canvas, not map-only decoration.

The chosen typography moves the main command line and numeric readouts toward uppercase and IBM Plex Mono instrumentation while keeping Space Grotesk for legible supporting copy.

## Full-stack assumptions

The current operational dataset is seeded lazily for the first Polaris 06 snapshot request. The seed is idempotent by mission code, so subsequent requests read the same persisted mission, six-person roster, routes, waypoints, assets, inventory, alerts, movement logs, and reports.

The six named people are represented as expedition team members with operational responsibility roles. Database write operations are restricted to authenticated admin operators, while the roster roles describe domain ownership and field responsibility. This keeps the prototype safe until a future user directory can map Manus identities to expedition roles directly.

The UI uses a graceful field-network error state when the snapshot query fails. The generated polar imagery is presentation-only; future versions should replace the current seeded route and telemetry values with verified weather, GPS, vehicle telemetry, inventory barcode, and notification integrations.
