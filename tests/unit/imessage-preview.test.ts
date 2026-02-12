import { describe, expect, it } from "vitest";
import {
  buildPreviewImageUrl,
  buildPreviewInviteUrl,
  formatIMessageTodayLabel,
  getPreviewDomain
} from "@/lib/imessage-preview";

describe("iMessage preview helpers", () => {
  it("builds invite and image urls from referral code", () => {
    expect(buildPreviewInviteUrl("ABC123")).toContain("/invite/ABC123");
    expect(buildPreviewImageUrl("ABC123")).toBe("/api/og/invite/ABC123.png");
  });

  it("uses fallback preview code when referral code is missing", () => {
    expect(buildPreviewInviteUrl()).toContain("/invite/PREVIEW");
    expect(buildPreviewImageUrl()).toBe("/api/og/invite/PREVIEW.png");
  });

  it("derives host from invite url", () => {
    expect(getPreviewDomain("https://daybreaktestflight.vercel.app/invite/ABC123")).toBe(
      "daybreaktestflight.vercel.app"
    );
  });

  it("formats timestamp as Today h:mm AM/PM", () => {
    const label = formatIMessageTodayLabel(new Date("2026-02-12T02:33:00"));
    expect(label.startsWith("Today ")).toBe(true);
    expect(/Today \d{1,2}:\d{2} [AP]M/.test(label)).toBe(true);
  });
});
