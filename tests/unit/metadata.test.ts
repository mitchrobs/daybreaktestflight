import { describe, expect, it } from "vitest";
import { buildInviteMetadataValues } from "@/lib/invite-meta";
import { buildInviteCardCopy } from "@/lib/og";

describe("invite metadata and og copy", () => {
  it("builds personalized title and image URL", () => {
    const values = buildInviteMetadataValues({
      referralCode: "ABC123",
      inviterName: "Mia"
    });

    expect(values.title).toContain("Mia invited you");
    expect(values.imageUrl).toContain("/api/og/invite/ABC123.png");
  });

  it("falls back safely when inviter is missing", () => {
    const copy = buildInviteCardCopy(null);

    expect(copy.headline).toBe("A friend invited you");
    expect(copy.subhead).toContain("NYT Games group chat");
  });
});
