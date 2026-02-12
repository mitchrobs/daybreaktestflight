import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/components/landing-page";
import { buildPreviewInviteUrl, getPreviewDomain } from "@/lib/imessage-preview";

describe("landing page invite preview", () => {
  it("renders iMessage-style thread without full iPhone chrome and with dynamic preview image url", () => {
    const markup = renderToStaticMarkup(createElement(LandingPage, { referralCode: "ABC123" }));
    const expectedDomain = getPreviewDomain(buildPreviewInviteUrl("ABC123"));

    expect(markup).not.toContain("ios-device-frame");
    expect(markup).toContain("Where are you?");
    expect(markup).toContain("Today");
    expect(markup).toContain("/api/og/invite/ABC123.png");
    expect(markup).toContain(expectedDomain);
  });
});
