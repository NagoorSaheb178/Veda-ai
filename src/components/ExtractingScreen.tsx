"use client";

import Image from "next/image";

export default function ExtractingScreen() {
  return (
    <div
      className="mobile-no-radius"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        gap: 12,
        width: "100%",
        minHeight: "60vh",
        height: "100%",
        maxWidth: "100%",
        background: "#FFFFFF",
        borderRadius: 24,
      }}
    >
      {/* AnalysingLoader */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          gap: 15,
          width: 177,
          height: 221.49,
        }}
      >
        {/* Container (Icon) */}
        <div style={{ position: "relative", width: 128.15, height: 134.49 }}>
          <Image src="/extract.png" alt="Extracting Icon" fill style={{ objectFit: "contain" }} />
        </div>

        {/* Text Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            width: 177,
            height: 72,
          }}
        >
          {/* Extracting... */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 159,
              height: 36,
            }}
          >
            <span
              className="font-bricolage"
              style={{
                width: 157,
                height: 36,
                fontWeight: 700,
                fontSize: 30,
                lineHeight: "36px",
                letterSpacing: "-1.2px",
                background: "linear-gradient(90deg, #303030 20%, #606060 40%, #808080 50%, #606060 60%, #303030 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                whiteSpace: "nowrap",
              }}
            >
              Extracting...
            </span>
          </div>

          {/* This may take a while */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 177,
              height: 36,
            }}
          >
            <span
              className="font-bricolage"
              style={{
                fontWeight: 400,
                fontSize: 20,
                lineHeight: "36px",
                textAlign: "center",
                letterSpacing: "-1.2px",
                color: "rgba(70, 70, 70, 0.75)",
                whiteSpace: "nowrap",
              }}
            >
              This may take a while
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
