import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/tokens";
import { logWaitlistEvent, saveVerificationToken, upsertPendingWaitlistUser } from "@/lib/waitlist-repo";
import { signupSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = signupSchema.parse(body);

    const { user, created } = await upsertPendingWaitlistUser({
      firstName: input.firstName,
      email: input.email,
      referralCode: input.referralCode
    });

    if (user.status !== "pending_email") {
      return NextResponse.json({
        ok: true,
        pendingConfirmation: false,
        referralCode: user.referral_code
      });
    }

    const verificationToken = generateVerificationToken();
    await saveVerificationToken({
      userId: user.id,
      rawToken: verificationToken
    });

    await sendConfirmationEmail({
      email: input.email,
      firstName: input.firstName,
      token: verificationToken
    });

    await logWaitlistEvent({
      userId: user.id,
      eventName: "confirmation_email_sent",
      payload: {
        created,
        has_referral_code: Boolean(input.referralCode)
      }
    });

    return NextResponse.json({
      ok: true,
      pendingConfirmation: true
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json(
      {
        ok: false,
        code: "SIGNUP_FAILED",
        message
      },
      { status: 400 }
    );
  }
}
