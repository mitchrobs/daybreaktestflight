import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/components/landing-page";
import { buildPreviewInviteUrl, getPreviewDomain } from "@/lib/imessage-preview";

describe("landing page invite preview", () => {
  it("renders iMessage-style thread without full iPhone chrome and with dynamic preview image url", () => {
    const markup = renderToStaticMarkup(createElement(LandingPage, { referralCode: "ABC123" }));
    const expectedDomain = getPreviewDomain(buildPreviewInviteUrl("ABC123"));
    const waitlistIndex = markup.indexOf("Request your invite");
    const previewIndex = markup.indexOf("imessage-thread");

    expect(markup).not.toContain("ios-device-frame");
    expect(markup).not.toContain('class="screen-header">iMessage invite preview');
    expect(markup).toContain("Drop your NYT score.");
    expect(markup).toContain("Today");
    expect(markup).toContain("typing-bubble");
    expect(markup).toContain("4 guesses is elite.");
    expect(markup).toContain("/api/og/invite/ABC123.png");
    expect(markup).toContain(expectedDomain);
    expect(waitlistIndex).toBeGreaterThan(-1);
    expect(previewIndex).toBeGreaterThan(waitlistIndex);
  });
});
