import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const missions = mysqlTable("missions", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  region: varchar("region", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["planning", "active", "complete", "paused"]).default("active").notNull(),
  readiness: int("readiness").default(0).notNull(),
  crewOnIce: int("crewOnIce").default(0).notNull(),
  crewCapacity: int("crewCapacity").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const teamMembers = mysqlTable("teamMembers", {
  id: int("id").autoincrement().primaryKey(),
  missionId: int("missionId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  role: mysqlEnum("role", ["Mission Commander", "Logistics & Supply Lead", "Route & Navigation Lead", "Fleet & Asset Lead", "Medical & Safety Officer", "Communications & Field Operations Lead"]).notNull(),
  status: mysqlEnum("status", ["on_ice", "checked_in", "standby", "off_duty"]).default("standby").notNull(),
  callSign: varchar("callSign", { length: 48 }),
  contactChannel: varchar("contactChannel", { length: 32 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const expeditionRoutes = mysqlTable("expeditionRoutes", {
  id: int("id").autoincrement().primaryKey(),
  missionId: int("missionId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  corridor: varchar("corridor", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["planned", "active", "complete", "watch"]).default("planned").notNull(),
  distanceKm: int("distanceKm").default(0).notNull(),
  etaUtc: timestamp("etaUtc"),
  iceRisk: mysqlEnum("iceRisk", ["low", "moderate", "high"]).default("low").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const waypoints = mysqlTable("waypoints", {
  id: int("id").autoincrement().primaryKey(),
  routeId: int("routeId").notNull(),
  code: varchar("code", { length: 32 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  sequence: int("sequence").default(0).notNull(),
  latitude: varchar("latitude", { length: 32 }),
  longitude: varchar("longitude", { length: 32 }),
  status: mysqlEnum("status", ["pending", "active", "complete"]).default("pending").notNull(),
});

export const assets = mysqlTable("assets", {
  id: int("id").autoincrement().primaryKey(),
  missionId: int("missionId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  type: varchar("type", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["in_transit", "standby", "service_due", "offline"]).default("standby").notNull(),
  signal: int("signal").default(0).notNull(),
  location: varchar("location", { length: 120 }),
  serviceDue: boolean("serviceDue").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const inventoryItems = mysqlTable("inventoryItems", {
  id: int("id").autoincrement().primaryKey(),
  missionId: int("missionId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  quantity: int("quantity").default(0).notNull(),
  unit: varchar("unit", { length: 24 }).notNull(),
  targetQuantity: int("targetQuantity").default(0).notNull(),
  daysCover: int("daysCover").default(0).notNull(),
  status: mysqlEnum("status", ["nominal", "watch", "critical"]).default("nominal").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  missionId: int("missionId").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  severity: mysqlEnum("severity", ["info", "watch", "critical"]).default("watch").notNull(),
  acknowledged: boolean("acknowledged").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const movementLogs = mysqlTable("movementLogs", {
  id: int("id").autoincrement().primaryKey(),
  missionId: int("missionId").notNull(),
  assetId: int("assetId"),
  teamMemberId: int("teamMemberId"),
  title: varchar("title", { length: 160 }).notNull(),
  detail: text("detail").notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
});

export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  missionId: int("missionId").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  type: mysqlEnum("type", ["route_brief", "inventory_snapshot", "incident_summary", "handover"]).notNull(),
  status: mysqlEnum("status", ["draft", "ready", "exported"]).default("draft").notNull(),
  summary: text("summary").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Mission = typeof missions.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type ExpeditionRoute = typeof expeditionRoutes.$inferSelect;
export type Waypoint = typeof waypoints.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type MovementLog = typeof movementLogs.$inferSelect;
export type Report = typeof reports.$inferSelect;
