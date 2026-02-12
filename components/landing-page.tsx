import React from "react";
import Link from "next/link";
import { GameIconShowcase } from "@/components/game-icon-showcase";
import { IMessagePreviewThread } from "@/components/imessage-preview-thread";
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

        <section className="hero-games" aria-labelledby="hero-title">
          <div className="hero-games-copy">
            <p className="hero-eyebrow">Invite-only iOS beta</p>
            <h1 className="hero-title" id="hero-title">
              Smart games and puzzles that you&apos;ll look forward to each day.
            </h1>

            <p className="hero-sub">Daily games, dynamic difficulty, and groups that stay in sync.</p>
          </div>

          <GameIconShowcase embedded />
        </section>

        <section className="imessage-screen-shell">
          <div className="visual-grid">
            <article className="imessage-screen" aria-label="iMessage invite preview">
              <div className="imessage-intro">
                <h2 className="imessage-heading">Import your games group chat in one click</h2>
                <p className="imessage-subheader">Daybreak groups share your daily game results with your friends.</p>
              </div>

              <div className="imessage-thread-shell">
                <IMessagePreviewThread
                  previewInviteUrl={previewInviteUrl}
                  previewImageUrl={previewImageUrl}
                  previewTitle={previewTitle}
                  previewDomain={previewDomain}
                />
              </div>
            </article>
          </div>
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

        <section className="early-access" aria-labelledby="early-access-title">
          <div className="early-access-copy">
            <h2 id="early-access-title">Get early access.</h2>
            <p>Join the waitlist, claim your private invite link, and bring your puzzle group in before public launch.</p>
          </div>

          <WaitlistForm
            referralCode={referralCode}
            title="Early Access"
            note="Use your Apple ID email. We will send your invite card as soon as your spot is confirmed."
            submitLabel="Start Playing"
          />
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
        <a className="cta primary cta-glow" href="#waitlist">
          Start Playing
        </a>
      </div>
    </div>
  );
}
