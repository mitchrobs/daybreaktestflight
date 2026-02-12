"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IMessageTimestamp } from "@/components/imessage-timestamp";

type IMessagePreviewThreadProps = {
  previewInviteUrl: string;
  previewImageUrl: string;
  previewTitle: string;
  previewDomain: string;
};

const SCORE_MESSAGE = "#106 3/6\n⬛⬛🟨⬛⬛\n⬛🟩⬛⬛⬛\n🟩🟩🟩🟩🟩";
const OUTGOING_GROUP_MESSAGE = "made a group for us on daybreak)";

type AnimationPhase = "idle" | "typing-message" | "message" | "typing-link" | "link";

export function IMessagePreviewThread({
  previewInviteUrl,
  previewImageUrl,
  previewTitle,
  previewDomain
}: IMessagePreviewThreadProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [phase, setPhase] = useState<AnimationPhase>("idle");

  useEffect(() => {
    if (hasEnteredView) {
      return;
    }

    const node = containerRef.current;
    if (!node || typeof window === "undefined") {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            obs.disconnect();
            break;
          }
        }
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -12% 0px"
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasEnteredView]);

  useEffect(() => {
    if (!hasEnteredView || typeof window === "undefined") {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setPhase("link");
      return;
    }

    setPhase("typing-message");

    const timers = [
      window.setTimeout(() => setPhase("message"), 950),
      window.setTimeout(() => setPhase("typing-link"), 1700),
      window.setTimeout(() => setPhase("link"), 2550)
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [hasEnteredView]);

  return (
    <div ref={containerRef} className="imessage-thread">
      <div className="imessage-bubble incoming score-bubble">{SCORE_MESSAGE}</div>
      <IMessageTimestamp />
      <div
        className={`imessage-bubble outgoing typing-bubble ${
          phase === "typing-message" || phase === "typing-link" ? "is-active" : "is-hidden"
        }`}
        aria-hidden="true">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <div
        className={`imessage-bubble outgoing note-bubble ${
          phase === "message" || phase === "typing-link" || phase === "link" ? "is-visible" : "is-hidden"
        }`}>
        {OUTGOING_GROUP_MESSAGE}
      </div>
      <div className={`imessage-bubble outgoing link-bubble ${phase === "link" ? "is-visible" : "is-hidden"}`}>
        <a className="imessage-link-card" href={previewInviteUrl} aria-label={previewTitle}>
          <div className="imessage-link-image-wrap">
            <Image
              src={previewImageUrl}
              alt={previewTitle}
              width={1200}
              height={630}
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
    </div>
  );
}
