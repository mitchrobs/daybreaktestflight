import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IMessageTimestamp } from "@/components/imessage-timestamp";
import { WaitlistForm } from "@/components/waitlist-form";
import { buildPreviewImageUrl, buildPreviewInviteUrl, getPreviewDomain } from "@/lib/imessage-preview";

type LandingPageProps = {
  referralCode?: string;
  inviterName?: string | null;
};

export function LandingPage({ referralCode, inviterName }: LandingPageProps) {
  const previewInviteUrl = buildPreviewInviteUrl(referralCode);
  const previewImageUrl = buildPreviewImageUrl(referralCode);
  const previewDomain = getPreviewDomain(previewInviteUrl);
  const previewTitle = inviterName ? `${inviterName} invited you to join Daybreak` : "Join Daybreak on TestFlight";

  return (
    <div className="landing-shell">
      <header className="topbar">
        <span className="wordmark">Daybreak</span>
        <span className="badge-pill">Private Beta</span>
      </header>

      <main>
        {inviterName ? (
          <section className="invite-banner" aria-live="polite">
            <strong>{inviterName}</strong> shared a personal invite with you. If you confirm your email, they get +5.
          </section>
        ) : null}

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-stack" id="hero-title">
            <div className="hero-line">You&apos;re</div>
            <div className="hero-line">Invited</div>
            <div className="hero-line">To Daybreak</div>
            <div className="hero-line">For NYT</div>
            <div className="hero-line">Group Chats</div>
          </div>

          <p className="hero-sub">
            Join the TestFlight queue, get your personal iMessage invite card, and bring your puzzle group in early.
          </p>

          <div className="hero-actions">
            <a className="cta primary" href="#waitlist">
              Request Invite
            </a>
            <a className="cta" href="#how-it-works">
              How It Works
            </a>
          </div>
        </section>

        <section className="visuals">
          <div className="visual-grid">
            <WaitlistForm referralCode={referralCode} />

            <article className="imessage-screen" aria-label="iMessage invite preview">
              <div className="imessage-thread">
                <div className="imessage-bubble incoming">Drop your NYT score.</div>
                <IMessageTimestamp />
                <div className="imessage-bubble outgoing typing-bubble" aria-hidden="true">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
                <div className="imessage-bubble outgoing link-bubble">
                  <a className="imessage-link-card" href={previewInviteUrl} aria-label={previewTitle}>
                    <div className="imessage-link-image-wrap">
                      <Image
                        src={previewImageUrl}
                        alt={previewTitle}
                        width={1200}
                        height={1200}
                        className="imessage-link-image-actual"
                        unoptimized
                      />
                    </div>
                    <div className="imessage-link-meta">
                      <strong>{previewTitle}</strong>
                      <span>{previewDomain}</span>
                    </div>
                  </a>
                </div>
                <div className="imessage-bubble incoming">4 guesses is elite.</div>
              </div>
            </article>
          </div>
        </section>

        <section className="copy">
          <p>Daybreak is a calm daily ritual for people already discussing Wordle and Connections every day.</p>
          <p>This beta is invitation-driven so each wave stays high-quality and conversational.</p>
          <p id="how-it-works">Once confirmed, your referral link carries your name into the rich-link preview image.</p>
        </section>

        <section className="steps">
          <article>
            <h3>01 Join</h3>
            <p>Use your Apple ID email.</p>
          </article>
          <article>
            <h3>02 Confirm</h3>
            <p>Unlock your personal invite link.</p>
          </article>
          <article>
            <h3>03 Invite</h3>
            <p>Each confirmed friend moves you up.</p>
          </article>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-links">
          <Link href="#waitlist">Waitlist</Link>
          <span>•</span>
          <a href="mailto:hello@daybreak.app">Contact</a>
          <span>•</span>
          <Link href="/">Daybreak</Link>
        </div>
        <div className="footer-meta">Invite-only beta • Built for iOS TestFlight • ©2026</div>
      </footer>

      <div className="mobile-sticky-cta">
        <a className="cta primary" href="#waitlist">
          Request Invite
        </a>
      </div>
    </div>
  );
}
