import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/components/landing-page";

describe("landing page invite preview", () => {
  it("removes legacy proof/invitation rows and renders the new fixed iMessage invite text", () => {
    const markup = renderToStaticMarkup(createElement(LandingPage, {}));

    expect(markup).not.toContain("Invite-only TestFlight access.");
    expect(markup).not.toContain("Weekly TestFlight waves");
    expect(markup).not.toContain("+5 per confirmed referral");
    expect(markup).not.toContain("Submit signup");
    expect(markup).not.toContain("Confirm email");
    expect(markup).not.toContain("Share invite link");
    expect(markup).not.toContain("Climb queue");

    expect(markup).toContain("I&#x27;m trying Daybreak. Join me and share your NYT puzzle results here too.");
  });
});
