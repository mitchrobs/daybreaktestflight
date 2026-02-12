"use client";

import { useEffect } from "react";
import { trackPlausibleEvent } from "@/lib/plausible";

export function ReferralViewTracker({ code }: { code: string }) {
  useEffect(() => {
    trackPlausibleEvent("referral_landing_view", { has_code: code ? 1 : 0 });
  }, [code]);

  return null;
}
