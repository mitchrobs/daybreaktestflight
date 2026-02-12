import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Sora } from "next/font/google";
import "@/app/globals.css";
import { PLAUSIBLE_DOMAIN, SITE_URL } from "@/lib/config";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Daybreak — Private TestFlight Waitlist",
  description: "Join the invite-only Daybreak TestFlight waitlist and invite your NYT Games group chat.",
  openGraph: {
    title: "Daybreak — Private TestFlight Waitlist",
    description: "Join the invite-only Daybreak TestFlight waitlist and invite your NYT Games group chat.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Daybreak — Private TestFlight Waitlist",
    description: "Join the invite-only Daybreak TestFlight waitlist and invite your NYT Games group chat."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${fraunces.variable}`}>
        {children}
        {PLAUSIBLE_DOMAIN ? (
          <Script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
