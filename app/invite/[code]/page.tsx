import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";
import { ReferralViewTracker } from "@/components/referral-view-tracker";
import { buildInviteMetadataValues } from "@/lib/invite-meta";
import { INVITE_OG_DIMENSIONS } from "@/lib/og";
import { getInviterByCode } from "@/lib/waitlist-repo";

type InvitePageParams = {
  code: string;
};

export const revalidate = 0;

export async function generateMetadata({
  params
}: {
  params: Promise<InvitePageParams>;
}): Promise<Metadata> {
  const { code } = await params;
  const inviter = await getInviterByCode(code);
  const { title, description, imageUrl } = buildInviteMetadataValues({
    referralCode: code,
    inviterName: inviter?.firstName
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: INVITE_OG_DIMENSIONS.width,
          height: INVITE_OG_DIMENSIONS.height,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}

export default async function InvitePage({
  params
}: {
  params: Promise<InvitePageParams>;
}) {
  const { code } = await params;
  const inviter = await getInviterByCode(code);

  return (
    <>
      <ReferralViewTracker code={code} />
      <LandingPage referralCode={code} inviterName={inviter?.firstName ?? null} />
    </>
  );
}
