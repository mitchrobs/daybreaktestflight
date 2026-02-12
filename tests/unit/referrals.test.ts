import { describe, expect, it } from "vitest";
import { REFERRAL_CREDIT_POINTS, assertNotSelfReferral, normalizeEmail, normalizeReferralCode } from "@/lib/referrals";

describe("referral rules", () => {
  it("uses fixed +5 credit", () => {
    expect(REFERRAL_CREDIT_POINTS).toBe(5);
  });

  it("blocks self referrals", () => {
    expect(() => assertNotSelfReferral("user-1", "user-1")).toThrowError("SELF_REFERRAL_BLOCKED");
  });

  it("normalizes email and referral code", () => {
    expect(normalizeEmail("  USER@Example.COM ")).toBe("user@example.com");
    expect(normalizeReferralCode(" abc123 ")).toBe("ABC123");
  });
});
