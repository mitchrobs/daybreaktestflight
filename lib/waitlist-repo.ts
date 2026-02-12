import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { assertNotSelfReferral, generateReferralCode, normalizeEmail, normalizeFirstName, normalizeReferralCode } from "@/lib/referrals";
import { hashToken } from "@/lib/tokens";

export type WaitlistStatus = "pending_email" | "active" | "invited" | "accepted" | "unsubscribed";

export type WaitlistUserRow = {
  id: string;
  first_name: string;
  email_normalized: string;
  email_raw: string;
  referral_code: string;
  status: WaitlistStatus;
  score: number;
  referred_by_user_id: string | null;
  created_at: string;
  confirmed_at: string | null;
  invited_at: string | null;
};

export type ConfirmResultRow = {
  user_id: string;
  referral_code: string;
  score: number;
  referrals: number;
  queue_rank: number;
  inviter_name: string | null;
};

export type WaitlistStatusRow = {
  user_id: string;
  first_name: string;
  referral_code: string;
  status: WaitlistStatus;
  score: number;
  referrals: number;
  queue_rank: number;
  inviter_name: string | null;
};

async function resolveInviterId(referralCode?: string): Promise<string | null> {
  if (!referralCode) {
    return null;
  }

  const normalizedCode = normalizeReferralCode(referralCode);
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("waitlist_users")
    .select("id")
    .eq("referral_code", normalizedCode)
    .in("status", ["active", "invited", "accepted"])
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.id ?? null;
}

async function createUniqueReferralCode(): Promise<string> {
  const supabase = getSupabaseAdminClient();

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = generateReferralCode(10);
    const { data, error } = await supabase
      .from("waitlist_users")
      .select("id")
      .eq("referral_code", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }
  }

  throw new Error("FAILED_TO_GENERATE_REFERRAL_CODE");
}

export async function upsertPendingWaitlistUser({
  firstName,
  email,
  referralCode
}: {
  firstName: string;
  email: string;
  referralCode?: string;
}): Promise<{ user: WaitlistUserRow; created: boolean }> {
  const supabase = getSupabaseAdminClient();
  const normalizedEmail = normalizeEmail(email);
  const normalizedFirstName = normalizeFirstName(firstName);

  const { data: existingUser, error: existingError } = await supabase
    .from("waitlist_users")
    .select("*")
    .eq("email_normalized", normalizedEmail)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  const inviterId = await resolveInviterId(referralCode);

  if (existingUser) {
    if (inviterId) {
      assertNotSelfReferral(inviterId, existingUser.id);
    }

    const updatePayload: Partial<WaitlistUserRow> = {
      first_name: normalizedFirstName,
      email_raw: email.trim()
    };

    if (existingUser.referred_by_user_id == null && inviterId && existingUser.status === "pending_email") {
      updatePayload.referred_by_user_id = inviterId;
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("waitlist_users")
      .update(updatePayload)
      .eq("id", existingUser.id)
      .select("*")
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { user: updatedUser as WaitlistUserRow, created: false };
  }

  const referralCodeForUser = await createUniqueReferralCode();

  const { data: insertedUser, error: insertError } = await supabase
    .from("waitlist_users")
    .insert({
      first_name: normalizedFirstName,
      email_normalized: normalizedEmail,
      email_raw: email.trim(),
      referral_code: referralCodeForUser,
      referred_by_user_id: inviterId,
      status: "pending_email",
      score: 0
    })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  await logWaitlistEvent({
    userId: insertedUser.id,
    eventName: "signup_submitted",
    payload: {
      referral_code_used: referralCode ? normalizeReferralCode(referralCode) : null,
      created: true
    }
  });

  return { user: insertedUser as WaitlistUserRow, created: true };
}

export async function saveVerificationToken({
  userId,
  rawToken,
  ttlHours = 48
}: {
  userId: string;
  rawToken: string;
  ttlHours?: number;
}) {
  const supabase = getSupabaseAdminClient();

  const { error: closeOldError } = await supabase
    .from("email_verification_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("used_at", null);

  if (closeOldError) {
    throw new Error(closeOldError.message);
  }

  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("email_verification_tokens").insert({
    user_id: userId,
    token_hash: hashToken(rawToken),
    expires_at: expiresAt
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function confirmWaitlistUser(rawToken: string): Promise<ConfirmResultRow> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.rpc("confirm_waitlist_user", {
    p_raw_token: rawToken
  });

  if (error) {
    throw new Error(error.message);
  }

  const firstRow = (data?.[0] ?? null) as ConfirmResultRow | null;

  if (!firstRow) {
    throw new Error("CONFIRMATION_FAILED");
  }

  return firstRow;
}

export async function getWaitlistStatusByCode(referralCode: string): Promise<WaitlistStatusRow | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase.rpc("get_waitlist_status_by_code", {
    p_referral_code: normalizeReferralCode(referralCode)
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data?.[0] ?? null) as WaitlistStatusRow | null;
}

export async function getInviterByCode(referralCode: string): Promise<{ firstName: string; referralCode: string } | null> {
  const status = await getWaitlistStatusByCode(referralCode);

  if (!status || !["active", "invited", "accepted"].includes(status.status)) {
    return null;
  }

  return {
    firstName: status.first_name,
    referralCode: status.referral_code
  };
}

export async function logWaitlistEvent({
  userId,
  eventName,
  payload
}: {
  userId: string | null;
  eventName: string;
  payload?: Record<string, unknown>;
}) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("waitlist_events").insert({
    user_id: userId,
    event_name: eventName,
    payload: payload ?? {}
  });

  if (error) {
    throw new Error(error.message);
  }
}
