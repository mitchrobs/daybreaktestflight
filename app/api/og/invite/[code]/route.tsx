import { ImageResponse } from "next/og";
import { buildInviteCardCopy } from "@/lib/og";
import { getInviterByCode } from "@/lib/waitlist-repo";

export const runtime = "nodejs";

const size = {
  width: 1200,
  height: 1200
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.replace(/\.png$/i, "");
  const inviter = await getInviterByCode(code);
  const copy = buildInviteCardCopy(inviter?.firstName);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(80% 80% at 12% 0%, rgba(128, 183, 255, 0.22), transparent 52%), radial-gradient(70% 70% at 88% 10%, rgba(255, 144, 144, 0.24), transparent 50%), #fafbfd",
          color: "#0b0b0b",
          fontFamily: "Helvetica"
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "28px",
            padding: "24px 32px",
            background: "rgba(255,255,255,0.78)"
          }}>
          <div style={{ display: "flex", letterSpacing: "0.2em", fontSize: 32, fontWeight: 600 }}>DAYBREAK</div>
          <div style={{ fontSize: 24, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.65 }}>TestFlight Beta</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 84, letterSpacing: "-0.02em", lineHeight: 1.05, fontWeight: 700 }}>{copy.headline}</div>
          <div style={{ fontSize: 56, letterSpacing: "-0.02em", lineHeight: 1.06, fontWeight: 500 }}>
            {copy.subhead}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "24px",
            padding: "20px 28px",
            background: "rgba(255,255,255,0.78)",
            fontSize: 28,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}>
          <span>Early iOS Access</span>
          <span>Invite-Only Queue</span>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
