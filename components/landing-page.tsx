import React from "react";
import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";

type LandingPageProps = {
  referralCode?: string;
  inviterName?: string | null;
};

export function LandingPage({ referralCode, inviterName }: LandingPageProps) {
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
            <article className="screen imessage-screen" aria-label="iMessage invite preview">
              <div className="screen-header">iMessage invite preview</div>
              <div className="imessage-header">
                <span className="imessage-back" aria-hidden="true">
                  Messages
                </span>
                <strong>NYT Games Group</strong>
              </div>
              <div className="imessage-thread">
                <div className="imessage-bubble incoming">Wordle 969 4/6. Needed every row.</div>
                <div className="imessage-bubble incoming alt">Connections: purple cooked me today.</div>
                <div className="imessage-bubble typing" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="imessage-bubble outgoing link-bubble">
                  <p>I&apos;m trying Daybreak. Join me and share your NYT puzzle results here too.</p>
                  <div className="imessage-link-card" role="img" aria-label={previewTitle}>
                    <div className="imessage-link-image">
                      <span>{inviterName ? `${inviterName} invited you` : "You invited your group chat"}</span>
                    </div>
                    <div className="imessage-link-meta">
                      <strong>{previewTitle}</strong>
                      <span>daybreak.app</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <WaitlistForm referralCode={referralCode} />
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
