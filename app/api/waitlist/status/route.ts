import { NextResponse } from "next/server";
import { getWaitlistStatusByCode } from "@/lib/waitlist-repo";
import { statusSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = statusSchema.parse({
      code: searchParams.get("code")
    });

    const status = await getWaitlistStatusByCode(parsed.code);

    if (!status) {
      return NextResponse.json(
        {
          ok: false,
          code: "NOT_FOUND",
          message: "No waitlist record found for that referral code."
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      userId: status.user_id,
      firstName: status.first_name,
      referralCode: status.referral_code,
      status: status.status,
      rank: status.queue_rank,
      score: status.score,
      referrals: status.referrals,
      inviterName: status.inviter_name
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json(
      {
        ok: false,
        code: "STATUS_FAILED",
        message
      },
      { status: 400 }
    );
  }
}
