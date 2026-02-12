import { SITE_URL } from "@/lib/config";
import { buildInviteDescription, buildInviteTitle } from "@/lib/metadata";

export function buildInviteMetadataValues({
  referralCode,
  inviterName
}: {
  referralCode: string;
  inviterName?: string | null;
}) {
  const title = buildInviteTitle(inviterName);
  const description = buildInviteDescription(inviterName);
  const imageUrl = `${SITE_URL}/api/og/invite/${encodeURIComponent(referralCode)}.png?v=1`;

  return {
    title,
    description,
    imageUrl
  };
}
