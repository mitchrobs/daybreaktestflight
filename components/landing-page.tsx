import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";

type LandingPageProps = {
  referralCode?: string;
  inviterName?: string | null;
};

export function LandingPage({ referralCode, inviterName }: LandingPageProps) {
  const date = new Date();
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const fullDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <span className="wordmark">Daybreak</span>
        </div>
      </header>

      <main>
        {inviterName ? (
          <section className="invite-banner" aria-live="polite">
            You were invited by <strong>{inviterName}</strong>
          </section>
        ) : null}

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-stack" id="hero-title">
            <div className="hero-line">Daily</div>
            <div className="hero-line">Games</div>
            <div className="hero-line">With Your</div>
            <div className="hero-line">NYT Group</div>
            <div className="hero-line">On Daybreak</div>
          </div>
        </section>

        <div className="hero-cta">
          <a className="cta" href="#waitlist">
            Join The Invite Queue
          </a>
        </div>

        <section className="visuals">
          <div className="date-row">
            <div className="day">
              {day}
              <span className="accent-dot">•</span>
            </div>
            <div className="date">{fullDate}</div>
          </div>

          <div className="visual-grid">
            <div className="screen">
              <div className="screen-header">What happens next</div>
              <div className="screen-item">
                <span>Join the queue</span>
                <span className="time">Now</span>
              </div>
              <div className="screen-item">
                <span>Confirm email</span>
                <span className="time">~1 min</span>
              </div>
              <div className="screen-item">
                <span>Get your invite link</span>
                <span className="time">Instant</span>
              </div>
              <div className="screen-item">
                <span>Move up with referrals</span>
                <span className="time">+5 each</span>
              </div>
            </div>

            <WaitlistForm referralCode={referralCode} />
          </div>
        </section>

        <section className="copy">
          <p>
            Daybreak is a focused daily puzzle ritual designed for people who already compare Wordle and Connections in
            group chats.
          </p>
          <p>
            Every confirmed signup gets a personalized iMessage-ready invite link so your whole NYT Games group can join
            the beta queue together.
          </p>
          <p>TestFlight invites are sent in weekly waves. Referrals move confirmed members up by 5 spots each.</p>
        </section>

        <div className="hero-cta bottom">
          <a className="cta" href="#waitlist">
            Get On The List
          </a>
        </div>
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
    </>
  );
}
