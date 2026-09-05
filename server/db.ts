import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  alerts,
  assets,
  expeditionRoutes,
  inventoryItems,
  missions,
  movementLogs,
  reports,
  teamMembers,
  users,
  waypoints,
  type InsertUser,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

async function ensurePolarSeed() {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await db.select().from(missions).where(eq(missions.code, "POLARIS 06")).limit(1);
  if (existing[0]) return existing[0];

  const missionInsert = await db.insert(missions).values({
    code: "POLARIS 06",
    name: "Polaris 06",
    region: "Antarctica / East corridor",
    status: "active",
    readiness: 86,
    crewOnIce: 18,
    crewCapacity: 24,
  });
  const missionId = Number(missionInsert[0].insertId);

  await db.insert(teamMembers).values([
    { missionId, name: "Ayush Raj", role: "Mission Commander", status: "on_ice", callSign: "NORTHSTAR", contactChannel: "CH-01" },
    { missionId, name: "Anmol Singh", role: "Logistics & Supply Lead", status: "checked_in", callSign: "CACHE", contactChannel: "CH-02" },
    { missionId, name: "Sambhav Kumar", role: "Route & Navigation Lead", status: "on_ice", callSign: "MERIDIAN", contactChannel: "CH-03" },
    { missionId, name: "Neha Hegde", role: "Fleet & Asset Lead", status: "checked_in", callSign: "KESTREL", contactChannel: "CH-04" },
    { missionId, name: "Siva Charan", role: "Medical & Safety Officer", status: "on_ice", callSign: "MEDIC", contactChannel: "CH-05" },
    { missionId, name: "Srihari Mahale", role: "Communications & Field Operations Lead", status: "standby", callSign: "AURORA", contactChannel: "CH-06" },
  ]);

  const routeInsert = await db.insert(expeditionRoutes).values({
    missionId,
    name: "Traverse 04",
    corridor: "East corridor",
    status: "active",
    distanceKm: 126,
    etaUtc: new Date("2026-09-05T18:42:00Z"),
    iceRisk: "moderate",
    notes: "Primary movement corridor to Aurora Depot.",
  });
  const routeId = Number(routeInsert[0].insertId);
  await db.insert((await import("../drizzle/schema")).waypoints).values([
    { routeId, code: "CP-01", name: "Cape Discovery", sequence: 1, latitude: "84° 17' S", longitude: "112° 04' E", status: "complete" },
    { routeId, code: "KC-04", name: "Kestrel Camp", sequence: 2, latitude: "84° 10' S", longitude: "111° 18' E", status: "complete" },
    { routeId, code: "MS-07", name: "Meridian Shelf", sequence: 3, latitude: "83° 54' S", longitude: "110° 24' E", status: "active" },
    { routeId, code: "AD-12", name: "Aurora Depot", sequence: 4, latitude: "83° 31' S", longitude: "109° 10' E", status: "pending" },
  ]);

  const assetInsert = await db.insert(assets).values([
    { missionId, name: "Kestrel 02", type: "Tracked carrier", status: "in_transit", signal: 98, location: "MS-07 / East corridor", serviceDue: false },
    { missionId, name: "Twin Otter 7", type: "Fixed-wing aircraft", status: "standby", signal: 84, location: "Kestrel Camp", serviceDue: false },
    { missionId, name: "Mule 04", type: "Cargo sled", status: "service_due", signal: 0, location: "Cape Discovery", serviceDue: true },
  ]);
  const kestrelId = Number(assetInsert[0].insertId);

  await db.insert(inventoryItems).values([
    { missionId, name: "Jet A-1 fuel", category: "Fuel", quantity: 14920, unit: "L", targetQuantity: 22000, daysCover: 14, status: "watch" },
    { missionId, name: "Provisions", category: "Food", quantity: 82, unit: "%", targetQuantity: 100, daysCover: 21, status: "nominal" },
    { missionId, name: "Medical stores", category: "Medicine", quantity: 94, unit: "%", targetQuantity: 100, daysCover: 30, status: "nominal" },
    { missionId, name: "Shelter systems", category: "Equipment", quantity: 76, unit: "%", targetQuantity: 100, daysCover: 18, status: "nominal" },
  ]);

  await db.insert(alerts).values([
    { missionId, title: "Fuel margin tightening", description: "East corridor burn rate is 8% above plan.", severity: "watch" },
    { missionId, title: "Weather window confirmed", description: "Visibility opens for Aurora Depot at 14:20Z.", severity: "info" },
    { missionId, title: "Service interval reached", description: "Mule 04 requires a track inspection before redeploy.", severity: "critical" },
  ]);

  await db.insert(movementLogs).values([
    { missionId, assetId: kestrelId, title: "Kestrel 02 crossed waypoint MS-07", detail: "East corridor · In transit · 64 km/h", status: "ON ROUTE", occurredAt: new Date("2026-09-05T09:38:00Z") },
    { missionId, teamMemberId: 4, title: "Neha Hegde checked in at Kestrel Camp", detail: "Fleet & Asset Lead · Comms channel 04", status: "CHECKED IN", occurredAt: new Date("2026-09-05T09:21:00Z") },
    { missionId, title: "Provision cache scanned into Aurora Depot", detail: "28 cases · Receiving complete", status: "LOGGED", occurredAt: new Date("2026-09-05T08:56:00Z") },
  ]);

  await db.insert(reports).values([
    { missionId, title: "Traverse 04 route brief", type: "route_brief", status: "ready", summary: "East corridor movement remains on schedule with moderate ice risk." },
    { missionId, title: "Polaris 06 handover", type: "handover", status: "draft", summary: "Shift handover covering fuel margin, crew status, and asset service needs." },
  ]);
  return (await db.select().from(missions).where(eq(missions.id, missionId)).limit(1))[0];
}

export async function getMissionSnapshot() {
  const db = await getDb();
  if (!db) return null;
  const mission = await ensurePolarSeed();
  if (!mission) return null;
  const [members, routes, inventory, assetRows, alertRows, movementRows, reportRows, waypointRows] = await Promise.all([
    db.select().from(teamMembers).where(eq(teamMembers.missionId, mission.id)),
    db.select().from(expeditionRoutes).where(eq(expeditionRoutes.missionId, mission.id)),
    db.select().from(inventoryItems).where(eq(inventoryItems.missionId, mission.id)),
    db.select().from(assets).where(eq(assets.missionId, mission.id)),
    db.select().from(alerts).where(and(eq(alerts.missionId, mission.id), eq(alerts.acknowledged, false))).orderBy(desc(alerts.createdAt)),
    db.select().from(movementLogs).where(eq(movementLogs.missionId, mission.id)).orderBy(desc(movementLogs.occurredAt)),
    db.select().from(reports).where(eq(reports.missionId, mission.id)).orderBy(desc(reports.createdAt)),
    db.select().from(waypoints).orderBy(waypoints.sequence),
  ]);
  return { mission, members, routes, inventory, assets: assetRows, alerts: alertRows, movements: movementRows, reports: reportRows, waypoints: waypointRows };
}

export async function acknowledgeAlert(alertId: number) {
  const db = await getDb();
  if (!db) return false;
  await db.update(alerts).set({ acknowledged: true }).where(eq(alerts.id, alertId));
  return true;
}

export async function updateInventoryQuantity(itemId: number, quantity: number) {
  const db = await getDb();
  if (!db) return false;
  await db.update(inventoryItems).set({ quantity }).where(eq(inventoryItems.id, itemId));
  return true;
}

export async function updateWaypointStatus(waypointId: number, status: "pending" | "active" | "complete") {
  const db = await getDb();
  if (!db) return false;
  await db.update(waypoints).set({ status }).where(eq(waypoints.id, waypointId));
  return true;
}

export async function updateMemberStatus(memberId: number, status: "on_ice" | "checked_in" | "standby" | "off_duty") {
  const db = await getDb();
  if (!db) return false;
  await db.update(teamMembers).set({ status }).where(eq(teamMembers.id, memberId));
  return true;
}

export async function createReport(input: { title: string; type: "route_brief" | "inventory_snapshot" | "incident_summary" | "handover"; summary: string; createdBy?: number }) {
  const db = await getDb();
  if (!db) return null;
  const mission = await ensurePolarSeed();
  if (!mission) return null;
  const result = await db.insert(reports).values({ missionId: mission.id, ...input, status: "draft" });
  return Number(result[0].insertId);
}

export async function generateReport(type: "route_brief" | "inventory_snapshot" | "incident_summary" | "handover", createdBy?: number) {
  const snapshot = await getMissionSnapshot();
  if (!snapshot) return null;
  const titleByType = { route_brief: "Traverse 04 route brief", inventory_snapshot: "Polaris 06 inventory snapshot", incident_summary: "Polaris 06 incident summary", handover: "Polaris 06 handover" };
  const summary = type === "route_brief"
    ? `${snapshot.routes.length} route(s) tracked; ${snapshot.routes.filter(route => route.status === "active").length} active corridor(s). Current ice risk: ${snapshot.routes[0]?.iceRisk ?? "unknown"}.`
    : type === "inventory_snapshot"
      ? `${snapshot.inventory.length} inventory lines monitored; ${snapshot.inventory.filter(item => item.status !== "nominal").length} line(s) require attention.`
      : type === "incident_summary"
        ? `${snapshot.alerts.length} open alert(s) remain. Critical alerts: ${snapshot.alerts.filter(alert => alert.severity === "critical").length}.`
        : `Crew ${snapshot.mission.crewOnIce}/${snapshot.mission.crewCapacity} on ice; readiness ${snapshot.mission.readiness}%; ${snapshot.assets.filter(asset => asset.serviceDue).length} asset(s) due service.`;
  return createReport({ title: titleByType[type], type, summary, createdBy });
}
