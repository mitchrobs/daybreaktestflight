"use client";

import React, { FormEvent, useState } from "react";
import { trackPlausibleEvent } from "@/lib/plausible";

type WaitlistFormProps = {
  referralCode?: string;
};

type SignupResponse =
  | {
      ok: true;
      pendingConfirmation: boolean;
      referralCode?: string;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

export function WaitlistForm({ referralCode }: WaitlistFormProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successState, setSuccessState] = useState<"none" | "pending" | "already">("none");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          email,
          referralCode
        })
      });

      const body = (await response.json()) as SignupResponse;

      if (!response.ok || !body.ok) {
        setErrorMessage(body.ok ? "Could not complete signup." : body.message);
        return;
      }

      if (body.pendingConfirmation) {
        setSuccessState("pending");
        trackPlausibleEvent("signup_submitted", {
          referral: referralCode ? 1 : 0
        });
      } else {
        setSuccessState("already");
      }

      setFirstName("");
      setEmail("");
    } catch {
      setErrorMessage("Could not complete signup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="waitlist-card" id="waitlist">
      <div className="screen-header">Request your invite</div>
      <p className="waitlist-note">
        Use the Apple ID email you want for TestFlight. Confirm your inbox to activate your invite link.
      </p>

      <form onSubmit={handleSubmit} className="waitlist-form" noValidate>
        <label className="field-label" htmlFor="first-name">
          First name
        </label>
        <input
          className="field"
          id="first-name"
          name="firstName"
          value={firstName}
          autoComplete="given-name"
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Alex"
          required
        />

        <label className="field-label" htmlFor="email">
          Apple ID email
        </label>
        <input
          className="field"
          id="email"
          name="email"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@icloud.com"
          required
          type="email"
        />

        <button className="cta" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Join The Queue"}
        </button>
      </form>

      {successState === "pending" ? (
        <p className="success-message">Check your inbox. Confirm to unlock your personalized invite card.</p>
      ) : null}

      {successState === "already" ? (
        <p className="success-message">You are already confirmed in the Daybreak queue.</p>
      ) : null}

      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
    </div>
  );
}
