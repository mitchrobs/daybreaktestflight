import { Resend } from "resend";
import { getServerEnv, SITE_URL } from "@/lib/config";

export async function sendConfirmationEmail({
  email,
  firstName,
  token
}: {
  email: string;
  firstName: string;
  token: string;
}) {
  const { resendApiKey, resendFromEmail } = getServerEnv();

  if (!resendApiKey || !resendFromEmail) {
    throw new Error("Missing RESEND configuration");
  }

  const resend = new Resend(resendApiKey);
  const confirmUrl = `${SITE_URL}/confirm?token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: resendFromEmail,
    to: email,
    subject: "Confirm your Daybreak beta signup",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0b0b0b;">
        <h2 style="margin-bottom: 8px;">Hi ${firstName},</h2>
        <p>Confirm your email to lock your Daybreak waitlist spot and unlock your personal invite link.</p>
        <p>
          <a href="${confirmUrl}" style="display: inline-block; padding: 10px 16px; border-radius: 999px; background: #0b0b0b; color: #ffffff; text-decoration: none;">Confirm my spot</a>
        </p>
        <p style="font-size: 13px; color: #555;">If the button does not work, copy this URL:</p>
        <p style="font-size: 13px;"><a href="${confirmUrl}">${confirmUrl}</a></p>
      </div>
    `
  });
}
