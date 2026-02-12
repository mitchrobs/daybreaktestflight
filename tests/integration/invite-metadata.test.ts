import { beforeEach, describe, expect, it, vi } from "vitest";

const getInviterByCodeMock = vi.fn();

vi.mock("@/lib/waitlist-repo", () => ({
  getInviterByCode: getInviterByCodeMock
}));

describe("invite page metadata", () => {
  beforeEach(() => {
    vi.resetModules();
    getInviterByCodeMock.mockReset();
  });

  it("renders personalized og:title and og:image", async () => {
    getInviterByCodeMock.mockResolvedValue({ firstName: "Taylor", referralCode: "ABC123" });

    const module = await import("@/app/invite/[code]/page");
    const metadata = await module.generateMetadata({
      params: Promise.resolve({ code: "ABC123" })
    });

    expect(metadata.title).toContain("Taylor invited you");
    expect(metadata.openGraph?.images).toBeDefined();

    const image = metadata.openGraph?.images?.[0] as { url: string };
    expect(image.url).toContain("/api/og/invite/ABC123.png");
  });
});
