import { describe, expect, it } from "vitest";
import { InMemoryWaitlistCore } from "@/lib/waitlist-core";

describe("signup -> confirm referral integration", () => {
  it("captures inviter attribution and credits exactly once", () => {
    const engine = new InMemoryWaitlistCore();

    const inviterSignup = engine.signup({
      firstName: "Alex",
      email: "alex@example.com"
    });
    engine.confirm(inviterSignup.token);

    const inviter = engine.getUserByEmail("alex@example.com");
    expect(inviter).not.toBeNull();

    const inviteeSignup = engine.signup({
      firstName: "Jamie",
      email: "jamie@example.com",
      referralCode: inviter!.referralCode
    });

    const inviteeBeforeConfirm = engine.getUserByEmail("jamie@example.com");
    expect(inviteeBeforeConfirm?.referredByUserId).toBe(inviter?.id);

    engine.confirm(inviteeSignup.token);

    const inviterAfterCredit = engine.getUserByEmail("alex@example.com");
    expect(inviterAfterCredit?.score).toBe(5);

    expect(() => engine.confirm(inviteeSignup.token)).toThrowError("INVALID_TOKEN");
    const inviterAfterSecondAttempt = engine.getUserByEmail("alex@example.com");
    expect(inviterAfterSecondAttempt?.score).toBe(5);
  });
});
