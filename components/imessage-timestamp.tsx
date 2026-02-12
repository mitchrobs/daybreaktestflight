"use client";

import React from "react";
import { useEffect, useState } from "react";
import { formatIMessageTodayLabel } from "@/lib/imessage-preview";

export function IMessageTimestamp() {
  const [label, setLabel] = useState(() => formatIMessageTodayLabel());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLabel(formatIMessageTodayLabel());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="imessage-timestamp" suppressHydrationWarning>
      {label}
    </div>
  );
}
