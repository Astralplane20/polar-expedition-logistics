import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { acknowledgeAlert, createReport, generateReport, getMissionSnapshot, updateInventoryQuantity, updateMemberStatus, updateWaypointStatus } from "./db";

// Mission-control writes are restricted to admin operators; the six expedition roles define responsibility, not database authority.
const operationsProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Mission-control admin access required" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  mission: router({ snapshot: publicProcedure.query(() => getMissionSnapshot()) }),
  alerts: router({
    acknowledge: operationsProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => acknowledgeAlert(input.id)),
  }),
  waypoints: router({
    updateStatus: operationsProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "active", "complete"]) })).mutation(({ input }) => updateWaypointStatus(input.id, input.status)),
  }),
  inventory: router({
    updateQuantity: operationsProcedure.input(z.object({ id: z.number().int().positive(), quantity: z.number().int().min(0) })).mutation(({ input }) => updateInventoryQuantity(input.id, input.quantity)),
  }),
  team: router({
    updateStatus: operationsProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["on_ice", "checked_in", "standby", "off_duty"]) })).mutation(({ input }) => updateMemberStatus(input.id, input.status)),
  }),
  reports: router({
    create: operationsProcedure.input(z.object({ title: z.string().min(3), type: z.enum(["route_brief", "inventory_snapshot", "incident_summary", "handover"]), summary: z.string().min(10) })).mutation(({ input, ctx }) => createReport({ ...input, createdBy: ctx.user.id })),
    generate: operationsProcedure.input(z.object({ type: z.enum(["route_brief", "inventory_snapshot", "incident_summary", "handover"]) })).mutation(({ input, ctx }) => generateReport(input.type, ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
