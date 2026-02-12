import { Suspense } from "react";
import { ConfirmClient } from "@/components/confirm-client";

export default function ConfirmPage() {
  return (
    <main className="confirm-page">
      <Suspense fallback={<p className="confirm-loading">Loading...</p>}>
        <ConfirmClient />
      </Suspense>
    </main>
  );
}
