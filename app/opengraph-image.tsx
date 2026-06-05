import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";
export const alt = "AioCast — Podcast SEO & title optimization";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050512 0%, #1e1b4b 45%, #312e81 100%)",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 800, color: "#ffffff", letterSpacing: -2 }}>AioCast</div>
        <div style={{ fontSize: 34, color: "rgba(255,255,255,0.88)", marginTop: 20, maxWidth: 900 }}>
          Podcast titles that rank — SEO growth pack from one episode
        </div>
      </div>
    ),
    { ...size },
  );
}
