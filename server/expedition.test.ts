import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(role: "admin" | "user" = "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test Operator",
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("expedition procedures", () => {
  it("rejects invalid duty status values for an admin operator", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.team.updateStatus({ id: 1, status: "deployed" as never })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects report drafts that are too short for an admin operator", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.reports.create({ title: "x", type: "handover", summary: "short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("blocks non-admin write access", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.team.updateStatus({ id: 1, status: "checked_in" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
