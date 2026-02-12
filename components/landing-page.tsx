import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";

type LandingPageProps = {
  referralCode?: string;
  inviterName?: string | null;
};

export function LandingPage({ referralCode, inviterName }: LandingPageProps) {
  return (
    <div className="landing-shell">
      <div className="orb orb-left" aria-hidden="true" />
      <div className="orb orb-right" aria-hidden="true" />

      <header className="site-header">
        <span className="wordmark">Daybreak</span>
        <a className="cta subtle desktop-only" href="#waitlist">
          Join Queue
        </a>
      </header>

      <main className="landing-main">
        {inviterName ? (
          <section className="invite-banner reveal" aria-live="polite">
            <p>
              You were invited by <strong>{inviterName}</strong>
            </p>
            <p>Your confirmed signup gives {inviterName} +5 queue points.</p>
          </section>
        ) : null}

        <section className="hero-grid" aria-labelledby="hero-title">
          <div className="hero-copy reveal">
            <p className="hero-tag">Private TestFlight Beta</p>
            <h1 id="hero-title" className="hero-title">
              Bring your NYT Games group chat into Daybreak first.
            </h1>
            <p className="hero-subtitle">
              Daily puzzle check-ins, tighter conversation, and a calmer iOS routine. Join the queue, confirm your
              email, and invite friends with your personalized iMessage preview card.
            </p>

            <div className="hero-chips">
              <span>iOS only</span>
              <span>Weekly invite waves</span>
              <span>+5 per confirmed referral</span>
            </div>

            <div className="hero-actions">
              <a className="cta" href="#waitlist">
                Request Access
              </a>
              <a className="cta subtle" href="#how-it-works">
                How It Works
              </a>
            </div>
          </div>

          <div className="hero-side reveal">
            <WaitlistForm referralCode={referralCode} />

            <aside className="preview-card" aria-label="Invite preview">
              <div className="preview-label">iMessage rich-link preview</div>
              <div className="preview-bubble">
                <div className="preview-bubble-title">
                  {inviterName ? `${inviterName} invited you` : "Your name appears here"}
                </div>
                <div className="preview-bubble-copy">Bring your NYT Games group chat to Daybreak.</div>
              </div>
            </aside>
          </div>
        </section>

        <section className="steps-section reveal" id="how-it-works">
          <h2>How the queue works</h2>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-index">01</span>
              <h3>Join with Apple ID email</h3>
              <p>Use the email you want on TestFlight and confirm it in one tap.</p>
            </article>
            <article className="step-card">
              <span className="step-index">02</span>
              <h3>Get your personal invite link</h3>
              <p>After confirmation, you unlock a custom share link with your name in the preview image.</p>
            </article>
            <article className="step-card">
              <span className="step-index">03</span>
              <h3>Move up with referrals</h3>
              <p>Each confirmed friend signup adds +5 points to your position.</p>
            </article>
          </div>
        </section>

        <section className="detail-grid reveal">
          <article className="detail-card">
            <h2>Why this beta is different</h2>
            <ul className="detail-list">
              <li>Built for puzzle players already sharing Wordle and Connections in group chats.</li>
              <li>Invite system is iMessage-native, not a generic referral spreadsheet.</li>
              <li>Manual weekly waves keep the TestFlight cohort intentional and high-signal.</li>
            </ul>
          </article>

          <article className="detail-card faq-card">
            <h2>FAQ</h2>
            <dl>
              <dt>When are invites sent?</dt>
              <dd>We send TestFlight invites in weekly waves.</dd>
              <dt>Does referral signup count instantly?</dt>
              <dd>No. Referral points are added only after email confirmation.</dd>
              <dt>What devices are supported?</dt>
              <dd>iPhone on iOS through Apple TestFlight.</dd>
            </dl>
          </article>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-links">
          <Link href="#waitlist">Waitlist</Link>
          <span>•</span>
          <a href="mailto:hello@daybreak.app">Contact</a>
          <span>•</span>
          <Link href="/">Daybreak</Link>
        </div>
        <div className="footer-meta">Invite-only beta • iOS TestFlight • ©2026</div>
      </footer>

      <div className="mobile-sticky-cta">
        <a className="cta" href="#waitlist">
          Join The Queue
        </a>
      </div>
    </div>
  );
}
