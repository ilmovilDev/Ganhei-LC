/**
 * day.service.test.ts
 *
 * Strategy: mock Prisma at the module level with vi.mock so every test
 * controls exactly what the DB returns — zero real I/O, zero flakiness.
 *
 * Coverage targets
 * ─────────────────────────────────────────────────────────────────────
 *  createDay   │ happy path, P2002 duplicate, unexpected DB error
 *  updateDay   │ happy path (full + partial), not-found / wrong owner,
 *              │ earnings replace branch, unexpected DB error
 *  deleteDay   │ happy path, not-found (count=0), unexpected DB error
 * ─────────────────────────────────────────────────────────────────────
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@/generated/prisma/client";
import { ErrorCode } from "@/lib/errors/error-codes";
import { App } from "@/generated/prisma/enums";

// ─────────────────────────────────────────────
// 1. Prisma mock — vi.hoisted() garante que as variáveis existem
//    ANTES do vi.mock() ser executado (ambos são hoisted pelo Vitest,
//    mas vi.hoisted corre primeiro que vi.mock na ordem de hoisting)
// ─────────────────────────────────────────────

const { txMock, prismaMock } = vi.hoisted(() => {
  const txMock = {
    day: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    earning: {
      createMany: vi.fn(),
      deleteMany: vi.fn(),
      aggregate: vi.fn(),
    },
    expense: {
      aggregate: vi.fn(),
    },
  };

  const prismaMock = {
    $transaction: vi.fn(),
    day: {
      deleteMany: vi.fn(),
    },
  };

  return { txMock, prismaMock };
});

vi.mock("@/lib/db/prisma", () => ({ prisma: prismaMock }));

// ─────────────────────────────────────────────
// 2. Subject under test (imported AFTER mock)
// ─────────────────────────────────────────────

import { dayService } from "./day.service";

// ─────────────────────────────────────────────
// 3. Shared fixtures
// ─────────────────────────────────────────────

const CLERK_ID = "user_test_clerk";
const DAY_ID = "day_cuid_001";
const TODAY = new Date("2024-06-01T00:00:00.000Z");

const baseFormData = {
  date: TODAY,
  hours: 8,
  kilometers: 120.5,
  earnings: [
    { app: App.UBER, amount: 150.0 },
    { app: App.IFOOD, amount: 80.5 },
  ],
};

/**
 * Makes $transaction execute the callback synchronously with txMock,
 * simulating Prisma's interactive transactions.
 */
function mockTransactionSuccess() {
  prismaMock.$transaction.mockImplementation(
    (cb: (tx: typeof txMock) => Promise<unknown>) => cb(txMock),
  );
}

/** Simulates Prisma throwing inside $transaction. */
function mockTransactionThrow(error: unknown) {
  prismaMock.$transaction.mockRejectedValue(error);
}

/** Default aggregate stubs — earnings sum = 230.50, expenses = 0 */
function mockDefaultAggregates() {
  txMock.earning.aggregate.mockResolvedValue({
    _sum: { amount: new Prisma.Decimal("230.50") },
  });
  txMock.expense.aggregate.mockResolvedValue({
    _sum: { amount: new Prisma.Decimal("0") },
  });
}

// ─────────────────────────────────────────────
// 4. Reset between tests
// ─────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();

  // Default happy-path stubs (overridden per-test when needed)
  txMock.day.create.mockResolvedValue({ id: DAY_ID });
  txMock.day.update.mockResolvedValue({});
  txMock.day.findUnique.mockResolvedValue({ clerkId: CLERK_ID });
  txMock.earning.createMany.mockResolvedValue({ count: 2 });
  txMock.earning.deleteMany.mockResolvedValue({ count: 2 });
  mockDefaultAggregates();
});

// ═════════════════════════════════════════════
// createDay
// ═════════════════════════════════════════════

describe("dayService.createDay", () => {
  it("returns ok({ success: true }) on happy path", async () => {
    mockTransactionSuccess();

    const result = await dayService.createDay(CLERK_ID, baseFormData);

    expect(result).toEqual({ success: true, data: { success: true } });
  });

  it("calls tx.day.create with correct clerkId, date, hours and kilometers", async () => {
    mockTransactionSuccess();

    await dayService.createDay(CLERK_ID, baseFormData);

    expect(txMock.day.create).toHaveBeenCalledWith({
      data: {
        clerkId: CLERK_ID,
        date: TODAY,
        hours: 8,
        kilometers: new Prisma.Decimal(120.5),
      },
      select: { id: true },
    });
  });

  it("calls tx.earning.createMany with all earnings mapped to Decimal", async () => {
    mockTransactionSuccess();

    await dayService.createDay(CLERK_ID, baseFormData);

    expect(txMock.earning.createMany).toHaveBeenCalledWith({
      data: [
        { dayId: DAY_ID, app: App.UBER, amount: new Prisma.Decimal(150.0) },
        { dayId: DAY_ID, app: App.IFOOD, amount: new Prisma.Decimal(80.5) },
      ],
    });
  });

  it("recalculates totals and updates the day after insert", async () => {
    mockTransactionSuccess();

    await dayService.createDay(CLERK_ID, baseFormData);

    // update must be called with the aggregated totals
    expect(txMock.day.update).toHaveBeenCalledWith({
      where: { id: DAY_ID },
      data: {
        totalEarnings: new Prisma.Decimal("230.50"),
        totalExpenses: new Prisma.Decimal("0"),
        netProfit: new Prisma.Decimal("230.50"),
      },
    });
  });

  it("returns fail with DAY_ALREADY_EXISTS on Prisma P2002", async () => {
    const p2002 = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      { code: "P2002", clientVersion: "5.0.0" },
    );
    mockTransactionThrow(p2002);

    const result = await dayService.createDay(CLERK_ID, baseFormData);

    expect(result).toMatchObject({
      success: false,
      error: {
        code: ErrorCode.DAY_ALREADY_EXISTS,
        status: 409,
      },
    });
  });

  it("returns fail with INTERNAL_ERROR on unexpected DB error", async () => {
    mockTransactionThrow(new Error("Connection refused"));

    const result = await dayService.createDay(CLERK_ID, baseFormData);

    expect(result).toMatchObject({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        status: 500,
      },
    });
  });

  it("returns fail with INTERNAL_ERROR on non-Error thrown value", async () => {
    mockTransactionThrow("string rejection");

    const result = await dayService.createDay(CLERK_ID, baseFormData);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.INTERNAL_ERROR },
    });
  });
});

// ═════════════════════════════════════════════
// updateDay
// ═════════════════════════════════════════════

describe("dayService.updateDay", () => {
  const fullInput = {
    id: DAY_ID,
    clerkId: CLERK_ID,
    ...baseFormData,
  };

  // ── Happy paths ──────────────────────────

  it("returns ok({ success: true }) when all fields are updated", async () => {
    mockTransactionSuccess();

    const result = await dayService.updateDay(fullInput);

    expect(result).toEqual({ success: true, data: { success: true } });
  });

  it("updates day with only provided scalar fields (partial update)", async () => {
    mockTransactionSuccess();

    await dayService.updateDay({ id: DAY_ID, clerkId: CLERK_ID, hours: 10 });

    expect(txMock.day.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: DAY_ID },
        data: { hours: 10 },
      }),
    );
  });

  it("does NOT call earning.deleteMany when earnings are not in input", async () => {
    mockTransactionSuccess();

    // No earnings key in input
    await dayService.updateDay({ id: DAY_ID, clerkId: CLERK_ID, hours: 6 });

    expect(txMock.earning.deleteMany).not.toHaveBeenCalled();
    expect(txMock.earning.createMany).not.toHaveBeenCalled();
  });

  it("replaces earnings (delete + createMany) when earnings are provided", async () => {
    mockTransactionSuccess();

    await dayService.updateDay(fullInput);

    expect(txMock.earning.deleteMany).toHaveBeenCalledWith({
      where: { dayId: DAY_ID },
    });
    expect(txMock.earning.createMany).toHaveBeenCalledWith({
      data: [
        { dayId: DAY_ID, app: App.UBER, amount: new Prisma.Decimal(150.0) },
        { dayId: DAY_ID, app: App.IFOOD, amount: new Prisma.Decimal(80.5) },
      ],
    });
  });

  it("recalculates and persists totals after update", async () => {
    mockTransactionSuccess();

    await dayService.updateDay(fullInput);

    // The second day.update call carries the totals
    const calls = txMock.day.update.mock.calls;
    const totalsCall = calls[calls.length - 1];

    expect(totalsCall[0]).toMatchObject({
      where: { id: DAY_ID },
      data: {
        totalEarnings: new Prisma.Decimal("230.50"),
        totalExpenses: new Prisma.Decimal("0"),
        netProfit: new Prisma.Decimal("230.50"),
      },
    });
  });

  it("updates date when provided", async () => {
    mockTransactionSuccess();
    const newDate = new Date("2024-05-15T00:00:00.000Z");

    await dayService.updateDay({
      id: DAY_ID,
      clerkId: CLERK_ID,
      date: newDate,
    });

    expect(txMock.day.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { date: newDate } }),
    );
  });

  it("updates kilometers as Prisma.Decimal when provided", async () => {
    mockTransactionSuccess();

    await dayService.updateDay({
      id: DAY_ID,
      clerkId: CLERK_ID,
      kilometers: 200,
    });

    expect(txMock.day.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { kilometers: new Prisma.Decimal(200) },
      }),
    );
  });

  // ── Ownership / not-found ────────────────

  it("returns fail with DAY_NOT_FOUND when day does not exist", async () => {
    txMock.day.findUnique.mockResolvedValue(null);
    mockTransactionSuccess();

    const result = await dayService.updateDay(fullInput);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.DAY_NOT_FOUND, status: 404 },
    });
  });

  it("returns fail with DAY_NOT_FOUND when clerkId does not match (ownership)", async () => {
    txMock.day.findUnique.mockResolvedValue({ clerkId: "user_other_clerk" });
    mockTransactionSuccess();

    const result = await dayService.updateDay(fullInput);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.DAY_NOT_FOUND, status: 404 },
    });
  });

  // ── Error paths ──────────────────────────

  it("returns fail with INTERNAL_ERROR on unexpected DB error", async () => {
    mockTransactionThrow(new Error("Timeout"));

    const result = await dayService.updateDay(fullInput);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.INTERNAL_ERROR, status: 500 },
    });
  });

  it("returns fail with INTERNAL_ERROR on non-Error thrown value", async () => {
    mockTransactionThrow(null);

    const result = await dayService.updateDay(fullInput);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.INTERNAL_ERROR },
    });
  });
});

// ═════════════════════════════════════════════
// deleteDay
// ═════════════════════════════════════════════

describe("dayService.deleteDay", () => {
  it("returns ok({ success: true }) when record is deleted", async () => {
    prismaMock.day.deleteMany.mockResolvedValue({ count: 1 });

    const result = await dayService.deleteDay(DAY_ID, CLERK_ID);

    expect(result).toEqual({ success: true, data: { success: true } });
  });

  it("calls prisma.day.deleteMany with compound id + clerkId filter", async () => {
    prismaMock.day.deleteMany.mockResolvedValue({ count: 1 });

    await dayService.deleteDay(DAY_ID, CLERK_ID);

    expect(prismaMock.day.deleteMany).toHaveBeenCalledWith({
      where: { id: DAY_ID, clerkId: CLERK_ID },
    });
  });

  it("returns fail with DAY_NOT_FOUND when count === 0 (not found or wrong owner)", async () => {
    prismaMock.day.deleteMany.mockResolvedValue({ count: 0 });

    const result = await dayService.deleteDay(DAY_ID, CLERK_ID);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.DAY_NOT_FOUND, status: 404 },
    });
  });

  it("does NOT expose whether the day belonged to another user (count=0 is opaque)", async () => {
    // Both "not found" and "wrong owner" must return the same error shape
    prismaMock.day.deleteMany.mockResolvedValue({ count: 0 });

    const notFound = await dayService.deleteDay("non_existent_id", CLERK_ID);
    const wrongOwner = await dayService.deleteDay(DAY_ID, "other_clerk");

    expect(notFound).toMatchObject({
      error: { code: ErrorCode.DAY_NOT_FOUND },
    });
    expect(wrongOwner).toMatchObject({
      error: { code: ErrorCode.DAY_NOT_FOUND },
    });
  });

  it("returns fail with INTERNAL_ERROR on unexpected DB error", async () => {
    prismaMock.day.deleteMany.mockRejectedValue(new Error("DB down"));

    const result = await dayService.deleteDay(DAY_ID, CLERK_ID);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.INTERNAL_ERROR, status: 500 },
    });
  });

  it("returns fail with INTERNAL_ERROR on non-Error thrown value", async () => {
    prismaMock.day.deleteMany.mockRejectedValue(undefined);

    const result = await dayService.deleteDay(DAY_ID, CLERK_ID);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.INTERNAL_ERROR },
    });
  });
});
