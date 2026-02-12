import { describe, expect, it } from "vitest";
import { InMemoryWaitlistCore } from "@/lib/waitlist-core";

describe("e2e referral flow", () => {
  it("tracks inviter -> invitee relationships across multiple referrals", () => {
    const engine = new InMemoryWaitlistCore();

    const inviter = engine.signup({ firstName: "Morgan", email: "morgan@example.com" });
    engine.confirm(inviter.token);

    const inviterUser = engine.getUserByEmail("morgan@example.com");

    const inviteeA = engine.signup({
      firstName: "Riley",
      email: "riley@example.com",
      referralCode: inviterUser!.referralCode
    });
    engine.confirm(inviteeA.token);

    const inviteeB = engine.signup({
      firstName: "Jordan",
      email: "jordan@example.com",
      referralCode: inviterUser!.referralCode
    });
    engine.confirm(inviteeB.token);

    const updatedInviter = engine.getUserByEmail("morgan@example.com");
    const updatedInviteeA = engine.getUserByEmail("riley@example.com");
    const updatedInviteeB = engine.getUserByEmail("jordan@example.com");

    expect(updatedInviteeA?.referredByUserId).toBe(updatedInviter?.id);
    expect(updatedInviteeB?.referredByUserId).toBe(updatedInviter?.id);
    expect(updatedInviter?.score).toBe(10);
  });
});
