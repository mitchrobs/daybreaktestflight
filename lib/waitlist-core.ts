import { REFERRAL_CREDIT_POINTS, assertNotSelfReferral, generateReferralCode, normalizeEmail, normalizeFirstName, normalizeReferralCode } from "@/lib/referrals";
import { generateVerificationToken } from "@/lib/tokens";

export type CoreStatus = "pending_email" | "active";

export type CoreUser = {
  id: string;
  firstName: string;
  email: string;
  referralCode: string;
  status: CoreStatus;
  score: number;
  confirmedAt: string | null;
  referredByUserId: string | null;
};

function makeId(index: number) {
  return `u_${index.toString().padStart(4, "0")}`;
}

export class InMemoryWaitlistCore {
  private users: CoreUser[] = [];

  private tokenToUser = new Map<string, string>();

  private creditedInvitees = new Set<string>();

  signup(input: {
    firstName: string;
    email: string;
    referralCode?: string;
  }): { user: CoreUser; token: string } {
    const email = normalizeEmail(input.email);
    const firstName = normalizeFirstName(input.firstName);
    const existing = this.users.find((candidate) => candidate.email === email);

    let inviter: CoreUser | undefined;

    if (input.referralCode) {
      const normalizedCode = normalizeReferralCode(input.referralCode);
      inviter = this.users.find(
        (candidate) => candidate.referralCode === normalizedCode && candidate.status === "active"
      );
    }

    let user = existing;

    if (!user) {
      user = {
        id: makeId(this.users.length + 1),
        firstName,
        email,
        referralCode: generateReferralCode(10),
        status: "pending_email",
        score: 0,
        confirmedAt: null,
        referredByUserId: inviter ? inviter.id : null
      };

      this.users.push(user);
    } else {
      user.firstName = firstName;
      if (!user.referredByUserId && inviter && user.status === "pending_email") {
        assertNotSelfReferral(inviter.id, user.id);
        user.referredByUserId = inviter.id;
      }
    }

    const token = generateVerificationToken(12);
    this.tokenToUser.set(token, user.id);

    return { user: { ...user }, token };
  }

  confirm(token: string): CoreUser {
    const userId = this.tokenToUser.get(token);

    if (!userId) {
      throw new Error("INVALID_TOKEN");
    }

    this.tokenToUser.delete(token);

    const user = this.users.find((candidate) => candidate.id === userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (user.status !== "active") {
      user.status = "active";
      user.confirmedAt = new Date().toISOString();

      if (user.referredByUserId) {
        assertNotSelfReferral(user.referredByUserId, user.id);

        if (!this.creditedInvitees.has(user.id)) {
          const inviter = this.users.find((candidate) => candidate.id === user.referredByUserId);
          if (inviter) {
            inviter.score += REFERRAL_CREDIT_POINTS;
            this.creditedInvitees.add(user.id);
          }
        }
      }
    }

    return { ...user };
  }

  getUserByEmail(email: string) {
    return this.users.find((candidate) => candidate.email === normalizeEmail(email)) ?? null;
  }

  getUserByReferralCode(referralCode: string) {
    return this.users.find((candidate) => candidate.referralCode === normalizeReferralCode(referralCode)) ?? null;
  }
}
