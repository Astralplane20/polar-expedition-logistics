# Full-stack expansion checklist

## Scope and data model
- [x] Define six team members and role permissions.
- [x] Define persistent models for missions, team members, routes, waypoints, assets, inventory items, alerts, movements, and reports.
- [x] Document assumptions for prototype seed data and future integrations.

## Backend foundation
- [x] Upgrade the project with backend, database, and user management.
- [x] Review generated full-stack conventions and available helpers.
- [x] Add schema and API/server procedures for core models.
- [x] Add safe seed data for the six-person team and Polaris 06 mission.

## Product workflows
- [x] Replace placeholder Routes view with persistent route/waypoint management.
- [x] Replace placeholder Inventory view with stock levels, thresholds, and adjustments.
- [x] Replace placeholder Assets view with telemetry/status/service data.
- [x] Replace placeholder People view with six-member roster and role assignments.
- [x] Replace placeholder Reports view with generated operational summaries.
- [x] Wire Overview metrics, alerts, movement log, and acknowledgement actions to backend data.
- [x] Add loading, empty, success, and error states.

## Validation and delivery
- [x] Verify TypeScript, build, and database/API flows.
- [x] Verify role-aware access behavior.
- [x] Verify responsive layouts and critical interactions.
- [x] Save a final checkpoint and deliver the project version.
- [x] Seed the roster with Ayush Raj, Anmol Singh, Sambhav Kumar, Neha Hegde, Siva Charan, and Srihari Mahale, each with one assigned operational role.

## Follow-up gaps identified during validation
- [x] Document seed-data assumptions, fallback behavior, and planned external integrations.
- [x] Implement backend-driven waypoint retrieval and editing, then replace hardcoded map waypoints.
- [x] Add report-generation logic or explicitly label the feature as draft creation.
- [x] Add visible error states for snapshot and mutation failures plus module empty states.
- [x] Implement role-based permissions for the six assigned roles and test them.
- [x] Re-verify upgraded module views on mobile and validate acknowledge, inventory update, status change, and report creation interactions.
