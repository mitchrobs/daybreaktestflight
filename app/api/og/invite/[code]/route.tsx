import { ImageResponse } from "next/og";
import { buildInviteCardCopy, getInviteTemplateDataUrl, INVITE_OG_DIMENSIONS } from "@/lib/og";
import { getInviterByCode } from "@/lib/waitlist-repo";

export const runtime = "nodejs";

const size = INVITE_OG_DIMENSIONS;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.replace(/\.png$/i, "");
  const inviter = await getInviterByCode(code);
  const copy = buildInviteCardCopy(inviter?.firstName);
  const inviteTemplateDataUrl = await getInviteTemplateDataUrl();
  const featuredGames = [
    { label: "MM", name: "Moji Mash", color: "#8b5cf6" },
    { label: "BR", name: "Bridges", color: "#3b82f6" },
    { label: "WH", name: "Whodunit", color: "#64748b" },
    { label: "BA", name: "Barter", color: "#14b8a6" },
    { label: "WO", name: "Wordie", color: "#0ea5e9" },
    { label: "MC", name: "Mini Crossword", color: "#0f766e" },
    { label: "MS", name: "Mini Sudoku", color: "#b45309" },
    { label: "TR", name: "Trivia", color: "#ea580c" }
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: inviteTemplateDataUrl
            ? "#e8edf8"
            : "radial-gradient(80% 80% at 12% 0%, rgba(128, 183, 255, 0.22), transparent 52%), radial-gradient(70% 70% at 88% 10%, rgba(255, 144, 144, 0.24), transparent 50%), #fafbfd",
          color: "#0b0b0b",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
        }}>
        {inviteTemplateDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={inviteTemplateDataUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: inviteTemplateDataUrl
              ? "linear-gradient(140deg, rgba(248, 250, 255, 0.72), rgba(238, 245, 255, 0.52) 55%, rgba(255, 255, 255, 0.68))"
              : "linear-gradient(140deg, rgba(248, 250, 255, 0.65), rgba(255, 255, 255, 0.5) 55%, rgba(255, 255, 255, 0.7))"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px 48px"
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "24px",
              padding: "18px 26px",
              background: "rgba(255,255,255,0.78)"
            }}>
            <div style={{ display: "flex", letterSpacing: "0.2em", fontSize: 26, fontWeight: 600 }}>DAYBREAK</div>
            <div style={{ fontSize: 18, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.65 }}>
              TestFlight Beta
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 950 }}>
            <div style={{ fontSize: 68, letterSpacing: "-0.02em", lineHeight: 1.02, fontWeight: 700 }}>{copy.headline}</div>
            <div style={{ fontSize: 39, letterSpacing: "-0.01em", lineHeight: 1.08, fontWeight: 500 }}>
              {copy.subhead}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10
            }}>
            <div style={{ fontSize: 18, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.72 }}>
              Today&apos;s game logos
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 9, maxWidth: 1080 }}>
              {featuredGames.map((game) => (
                <div
                  key={game.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.78)",
                    border: "1px solid rgba(0,0,0,0.1)",
                    padding: "6px 10px 6px 6px"
                  }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: 700,
                      background: game.color
                    }}>
                    {game.label}
                  </div>
                  <div style={{ fontSize: 16, color: "#171717", whiteSpace: "nowrap" }}>{game.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "22px",
              padding: "15px 22px",
              background: "rgba(255,255,255,0.78)",
              gap: 16
            }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 24, letterSpacing: "-0.01em", fontWeight: 600 }}>You&apos;re invited to our Daybreak group</span>
              <span style={{ fontSize: 17, opacity: 0.72 }}>Open your invite and start sharing game scores together.</span>
            </div>
            <span
              style={{
                fontSize: 17,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.14)",
                padding: "10px 16px",
                whiteSpace: "nowrap"
              }}>
              Open Invite
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
