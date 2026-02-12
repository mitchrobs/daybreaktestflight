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
    const incomingScoreIndex = markup.indexOf("#106 3/6");
    const outgoingPreviewIndex = markup.indexOf("link-bubble");

    expect(markup).not.toContain("ios-device-frame");
    expect(markup).not.toContain('class="screen-header">iMessage invite preview');
    expect(markup).toContain("Import your games group chat in one click");
    expect(markup).toContain("Daybreak groups share your daily game results with your friends");
    expect(markup).toContain("#106 3/6");
    expect(markup).toContain("⬛⬛🟨⬛⬛");
    expect(markup).toContain("⬛🟩⬛⬛⬛");
    expect(markup).toContain("🟩🟩🟩🟩🟩");
    expect(markup).toContain("Today");
    expect(markup).toContain("typing-bubble");
    expect(markup).not.toContain("4 guesses is elite.");
    expect(markup).not.toContain("Daybreak is a calm daily ritual");
    expect(markup).not.toContain("How It Works");
    expect(markup).toContain("/api/og/invite/ABC123.png");
    expect(markup).toContain(expectedDomain);
    expect(waitlistIndex).toBeGreaterThan(-1);
    expect(previewIndex).toBeGreaterThan(waitlistIndex);
    expect(incomingScoreIndex).toBeGreaterThan(-1);
    expect(outgoingPreviewIndex).toBeGreaterThan(incomingScoreIndex);
  });
});
