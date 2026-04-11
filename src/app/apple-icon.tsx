import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)",
      }}
    >
      <div
        style={{
          width: 128,
          height: 128,
          borderRadius: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f59e0b",
          boxShadow: "inset 0 0 0 8px rgba(10, 10, 10, 0.1)",
        }}
      >
        <span
          style={{
            color: "#0a0a0a",
            fontSize: 84,
            lineHeight: 1,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            marginTop: -4,
          }}
        >
          F
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
