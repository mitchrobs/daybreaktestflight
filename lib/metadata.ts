export const DEFAULT_INVITE_TITLE = "Join Daybreak on TestFlight";

export function buildInviteTitle(inviterFirstName?: string | null): string {
  if (!inviterFirstName) {
    return DEFAULT_INVITE_TITLE;
  }

  return `${inviterFirstName} invited you to join Daybreak`;
}

export function buildInviteDescription(inviterFirstName?: string | null): string {
  if (!inviterFirstName) {
    return "Daybreak is the daily puzzle ritual for curious minds.";
  }

  return `${inviterFirstName} thinks your NYT Games group chat should join Daybreak early.`;
}
