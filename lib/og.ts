import { readFile } from "node:fs/promises";
import path from "node:path";

export const INVITE_OG_DIMENSIONS = {
  width: 1200,
  height: 630
} as const;

const INVITE_TEMPLATE_PATH = path.join(process.cwd(), "public", "og", "invite-template-1200x630.png");
let inviteTemplatePromise: Promise<string | null> | null = null;

export function buildInviteCardCopy(inviterName?: string | null) {
  const safeName = inviterName?.trim() ? inviterName.trim() : "A friend";

  return {
    headline: `${safeName} invited you`,
    subhead: "Bring your NYT Games group chat to Daybreak."
  };
}

export async function getInviteTemplateDataUrl() {
  if (!inviteTemplatePromise) {
    inviteTemplatePromise = loadInviteTemplateDataUrl();
  }

  return inviteTemplatePromise;
}

async function loadInviteTemplateDataUrl() {
  try {
    const imageBuffer = await readFile(INVITE_TEMPLATE_PATH);
    return `data:image/png;base64,${imageBuffer.toString("base64")}`;
  } catch {
    return null;
  }
}
