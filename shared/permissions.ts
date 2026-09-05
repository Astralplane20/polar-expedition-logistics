export const expeditionRoles = [
  "Mission Commander",
  "Logistics & Supply Lead",
  "Route & Navigation Lead",
  "Fleet & Asset Lead",
  "Medical & Safety Officer",
  "Communications & Field Operations Lead",
] as const;

export type ExpeditionRole = (typeof expeditionRoles)[number];
export type ExpeditionCapability = "approve_mission" | "manage_inventory" | "edit_routes" | "manage_assets" | "manage_safety" | "manage_comms" | "view_all";

export const roleCapabilities: Record<ExpeditionRole, ExpeditionCapability[]> = {
  "Mission Commander": ["approve_mission", "view_all"],
  "Logistics & Supply Lead": ["manage_inventory", "view_all"],
  "Route & Navigation Lead": ["edit_routes", "view_all"],
  "Fleet & Asset Lead": ["manage_assets", "view_all"],
  "Medical & Safety Officer": ["manage_safety", "view_all"],
  "Communications & Field Operations Lead": ["manage_comms", "view_all"],
};

export function capabilitiesForRole(role: ExpeditionRole) {
  return roleCapabilities[role];
}
