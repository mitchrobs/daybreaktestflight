import { SITE_URL } from "@/lib/config";

export function buildPreviewInviteUrl(referralCode?: string): string {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const code = referralCode?.trim() ? referralCode : "PREVIEW";

  return `${baseUrl}/invite/${encodeURIComponent(code)}`;
}

export function buildPreviewImageUrl(referralCode?: string): string {
  const code = referralCode?.trim() ? referralCode : "PREVIEW";

  return `/api/og/invite/${encodeURIComponent(code)}.png`;
}

export function getPreviewDomain(previewInviteUrl: string): string {
  try {
    return new URL(previewInviteUrl).hostname;
  } catch {
    return "daybreak.app";
  }
}

export function formatIMessageTodayLabel(now = new Date()): string {
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(now);

  return `Today ${formattedTime}`;
}
