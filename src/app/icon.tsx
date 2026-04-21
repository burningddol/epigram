import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon(): ImageResponse {
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
        fontSize: 34,
        lineHeight: 1,
        paddingTop: 6,
      }}
    >
      {"\u201C"}
    </div>,
    { ...size }
  );
}
