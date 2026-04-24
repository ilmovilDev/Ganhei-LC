import { describe, it, expect, vi, beforeEach } from "vitest";
import { createEarningAction } from "./create-earning";
import { earningService } from "../services/earning-service";
import { auth } from "@clerk/nextjs/server";
import { App } from "@/generated/prisma/client";
import type { Mock } from "vitest";

/**
 * 🔥 MOCKS
 */
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("../services/earning-service", () => ({
  earningService: {
    createEarning: vi.fn(),
  },
}));

/**
 * 🔥 TYPES SAFE MOCKS
 */
const mockedAuth = auth as unknown as Mock;
const mockedService = earningService.createEarning as unknown as Mock;

describe("createEarningAction", () => {
  const mockUserId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ❌ NOT AUTHENTICATED
   */
  it("should throw if not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null });

    await expect(
      createEarningAction({
        date: new Date(),
        hours: 8,
        kilometers: 100,
        earnings: [{ app: App.UBER, amount: 100 }],
      }),
    ).rejects.toThrow("Não autorizado");
  });

  /**
   * ❌ ZOD VALIDATION
   */
  it("should validate input (zod)", async () => {
    mockedAuth.mockResolvedValue({ userId: mockUserId });

    await expect(createEarningAction({} as never)).rejects.toThrow();
  });

  /**
   * ✅ SUCCESS FLOW
   */
  it("should call service with correct data", async () => {
    mockedAuth.mockResolvedValue({ userId: mockUserId });

    mockedService.mockResolvedValue({ success: true });

    const input = {
      date: new Date(),
      hours: 8,
      kilometers: 100,
      earnings: [{ app: App.UBER, amount: 100 }],
    };

    const result = await createEarningAction(input);

    expect(mockedService).toHaveBeenCalledTimes(1);

    expect(mockedService).toHaveBeenCalledWith(
      mockUserId,
      expect.objectContaining({
        hours: 8,
        kilometers: 100,
        earnings: expect.arrayContaining([
          expect.objectContaining({
            app: App.UBER,
            amount: 100,
          }),
        ]),
      }),
    );

    expect(result.success).toBe(true);
  });

  /**
   * ❌ SERVICE ERROR
   */
  it("should handle service errors", async () => {
    mockedAuth.mockResolvedValue({ userId: mockUserId });

    mockedService.mockRejectedValue(new Error("DB error"));

    await expect(
      createEarningAction({
        date: new Date(),
        hours: 8,
        kilometers: 100,
        earnings: [{ app: App.UBER, amount: 100 }],
      }),
    ).rejects.toThrow("Erro ao criar ganhos");
  });
});
