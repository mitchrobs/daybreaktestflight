import { randomBytes } from "node:crypto";

export const REFERRAL_CREDIT_POINTS = 5;

const REFERRAL_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeFirstName(firstName: string): string {
  return firstName.trim().replace(/\s+/g, " ");
}

export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase();
}

export function assertNotSelfReferral(inviterUserId: string, inviteeUserId: string): void {
  if (inviterUserId === inviteeUserId) {
    throw new Error("SELF_REFERRAL_BLOCKED");
  }
}

export function generateReferralCode(length = 10): string {
  const bytes = randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += REFERRAL_ALPHABET[bytes[i] % REFERRAL_ALPHABET.length];
  }

  return result;
}
