import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/config";
import { logWaitlistEvent, confirmWaitlistUser } from "@/lib/waitlist-repo";
import { confirmSchema } from "@/lib/validation";

export const runtime = "nodejs";

function mapConfirmError(message: string) {
  if (message.includes("INVALID_TOKEN")) {
    return { status: 400, code: "INVALID_TOKEN", message: "This confirmation link is invalid." };
  }

  if (message.includes("TOKEN_EXPIRED")) {
    return { status: 400, code: "TOKEN_EXPIRED", message: "This confirmation link has expired." };
  }

  if (message.includes("TOKEN_ALREADY_USED")) {
    return {
      status: 400,
      code: "TOKEN_ALREADY_USED",
      message: "This confirmation link was already used. Request a fresh one from the signup form."
    };
  }

  return { status: 400, code: "CONFIRM_FAILED", message: "Could not confirm your waitlist spot." };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = confirmSchema.parse(body);

    const result = await confirmWaitlistUser(input.token);
    const shareUrl = `${SITE_URL}/invite/${result.referral_code}`;

    await logWaitlistEvent({
      userId: result.user_id,
      eventName: "confirmation_completed",
      payload: {
        queue_rank: result.queue_rank,
        referrals: result.referrals
      }
    });

    return NextResponse.json({
      ok: true,
      status: "active",
      referralCode: result.referral_code,
      shareUrl,
      rank: result.queue_rank,
      score: result.score,
      referrals: result.referrals,
      inviterName: result.inviter_name
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const mapped = mapConfirmError(message);

    return NextResponse.json(
      {
        ok: false,
        code: mapped.code,
        message: mapped.message
      },
      { status: mapped.status }
    );
  }
}
