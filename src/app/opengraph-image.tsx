import { ImageResponse } from "next/og";

export const alt = "Criska — AI-Enabled Technology Services Partner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social/AI share card (used when pages don't provide their own).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a1a24 0%, #11212d 100%)",
          padding: "72px 80px",
          color: "#eef1f0",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#a6afdd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a1a24",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            CK
          </div>
          <div style={{ fontSize: 30, letterSpacing: 8, fontWeight: 600, color: "#ccd0cf" }}>CRISKA</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 60, lineHeight: 1.12, maxWidth: 960 }}>
            Accelerating business growth
          </div>
          <div style={{ display: "flex", fontSize: 60, lineHeight: 1.12 }}>
            <span style={{ color: "#a6afdd", fontStyle: "italic" }}>through technology &amp; innovation</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 26, color: "#9ba8ab", fontFamily: "system-ui, sans-serif" }}>
            AI · Cloud · Cybersecurity · Software · Data · Staffing · Consulting
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#6d7f88", fontFamily: "system-ui, sans-serif" }}>
          <span>Since 2014 · Hyderabad, India</span>
          <span>India · UK · US</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
