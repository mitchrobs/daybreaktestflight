export function buildInviteCardCopy(inviterName?: string | null) {
  const safeName = inviterName?.trim() ? inviterName.trim() : "A friend";

  return {
    headline: `${safeName} invited you`,
    subhead: "Bring your NYT Games group chat to Daybreak."
  };
}
