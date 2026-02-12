import { describe, expect, it } from "vitest";
import { getQueueRank, sortQueue } from "@/lib/queue";

describe("queue ranking", () => {
  it("orders by score desc, then confirmedAt asc, then id asc", () => {
    const users = [
      { id: "b", score: 10, confirmedAt: "2026-02-11T10:00:00.000Z" },
      { id: "a", score: 10, confirmedAt: "2026-02-11T10:00:00.000Z" },
      { id: "c", score: 15, confirmedAt: "2026-02-11T12:00:00.000Z" },
      { id: "d", score: 10, confirmedAt: "2026-02-11T09:00:00.000Z" }
    ];

    const sorted = sortQueue(users).map((user) => user.id);
    expect(sorted).toEqual(["c", "d", "a", "b"]);
  });

  it("returns 0 when user is missing", () => {
    const rank = getQueueRank([{ id: "x", score: 0, confirmedAt: null }], "missing");
    expect(rank).toBe(0);
  });
});
