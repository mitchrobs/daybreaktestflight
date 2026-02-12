"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackPlausibleEvent } from "@/lib/plausible";

type ConfirmResponse =
  | {
      ok: true;
      status: "active";
      referralCode: string;
      shareUrl: string;
      rank: number;
      score: number;
      referrals: number;
      inviterName: string | null;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

export function ConfirmClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<Extract<ConfirmResponse, { ok: true }> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function runConfirmation() {
      if (!token) {
        setErrorMessage("Missing confirmation token.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/waitlist/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        });

        const body = (await response.json()) as ConfirmResponse;

        if (!response.ok || !body.ok) {
          setErrorMessage(body.ok ? "Could not confirm your signup." : body.message);
          setIsLoading(false);
          return;
        }

        setData(body);
        trackPlausibleEvent("signup_confirmed", {
          rank: body.rank,
          referrals: body.referrals
        });
      } catch {
        setErrorMessage("Could not confirm your signup. Try again from your latest confirmation email.");
      } finally {
        setIsLoading(false);
      }
    }

    runConfirmation();
  }, [token]);

  const imageUrl = useMemo(() => {
    if (!data) {
      return "";
    }

    return `/api/og/invite/${encodeURIComponent(data.referralCode)}.png?v=1`;
  }, [data]);

  async function copyLink() {
    if (!data) {
      return;
    }

    await navigator.clipboard.writeText(data.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (isLoading) {
    return <p className="confirm-loading">Confirming your Daybreak signup...</p>;
  }

  if (errorMessage) {
    return (
      <div className="confirm-state">
        <h1>We could not confirm your spot</h1>
        <p>{errorMessage}</p>
        <Link href="/" className="cta">
          Back to signup
        </Link>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="confirm-state">
      <h1>You are in the Daybreak waitlist</h1>
      <p>Share your personal link in your NYT Games group chat to move up faster.</p>

      <div className="confirm-stats">
        <div>
          <span>Queue rank</span>
          <strong>{data.rank}</strong>
        </div>
        <div>
          <span>Score</span>
          <strong>{data.score}</strong>
        </div>
        <div>
          <span>Referrals</span>
          <strong>{data.referrals}</strong>
        </div>
      </div>

      <Image
        className="invite-preview"
        src={imageUrl}
        alt="Personalized Daybreak invite preview"
        width={1200}
        height={1200}
        unoptimized
      />

      <div className="share-row">
        <input readOnly value={data.shareUrl} aria-label="Your invite link" />
        <button type="button" className="cta" onClick={copyLink}>
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      <p className="confirm-footnote">Each confirmed signup from your link adds +5 to your score.</p>
    </div>
  );
}
