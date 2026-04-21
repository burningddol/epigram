import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#52698e",
        color: "#ffffff",
        fontFamily: "serif",
        fontWeight: 700,
        fontSize: 190,
        lineHeight: 1,
        paddingTop: 32,
      }}
    >
      {"\u201C"}
    </div>,
    { ...size }
  );
}
