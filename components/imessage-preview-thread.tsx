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
const FOLLOW_UP_MESSAGE = "ngl I got lucky today";
const OUTGOING_INVITE_MESSAGE = "join the daybreak beta with my link and it will make a dedicated group for us";

type AnimationPhase = "idle" | "typing-link" | "link" | "typing-followup" | "followup";

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
      setPhase("followup");
      return;
    }

    setPhase("typing-link");
    const firstTimer = window.setTimeout(() => {
      setPhase("link");
    }, 2200);
    const secondTimer = window.setTimeout(() => {
      setPhase("typing-followup");
    }, 3600);
    const finalTimer = window.setTimeout(() => {
      setPhase("followup");
    }, 5400);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(secondTimer);
      window.clearTimeout(finalTimer);
    };
  }, [hasEnteredView]);

  const showTypingBubble = phase === "typing-link" || phase === "typing-followup";
  const showLinkBubble = phase === "link" || phase === "typing-followup" || phase === "followup";
  const showFollowupOutgoing = phase === "followup";

  return (
    <div ref={containerRef} className="imessage-thread">
      <div className="imessage-incoming-row">
        <div className="imessage-contact-mini" aria-hidden="true">
          <span className="imessage-contact-avatar">SR</span>
        </div>
        <div className="imessage-incoming-stack">
          <span className="imessage-contact-name">Sam</span>
          <div className="imessage-bubble incoming score-bubble">{SCORE_MESSAGE}</div>
          <div className="imessage-bubble incoming followup-bubble">{FOLLOW_UP_MESSAGE}</div>
        </div>
      </div>
      <IMessageTimestamp />
      <div className={`imessage-bubble outgoing typing-bubble ${showTypingBubble ? "is-active" : "is-hidden"}`} aria-hidden="true">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <div className={`imessage-bubble outgoing link-bubble ${showLinkBubble ? "is-visible" : "is-hidden"}`}>
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
      <div className={`imessage-bubble outgoing followup-outgoing-bubble ${showFollowupOutgoing ? "is-visible" : "is-hidden"}`}>
        {OUTGOING_INVITE_MESSAGE}
      </div>
    </div>
  );
}
