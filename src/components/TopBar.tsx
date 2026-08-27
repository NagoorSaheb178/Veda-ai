"use client";

import Image from "next/image";
import Link from "next/link";

export default function TopBar({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <header
      className="mobile-w-full responsive-topbar"
      style={{
        position: "absolute",
        width: `calc(100% - ${collapsed ? 86 : 327}px - 12px)`,
        height: 56,
        left: collapsed ? 86 : 327,
        top: 12,
        background: "rgba(255, 255, 255, 0.75)",
        borderRadius: 16,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0px 40px 0px 24px",
        boxSizing: "border-box",
        zIndex: 40,
      }}
    >
      {/* Left Section: Back Button, Breadcrumb (Desktop), Logo (Mobile) */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16 }}>
        {/* Desktop Breadcrumb: SVG Back Arrow + Icon + Text */}
        <div className="desktop-only" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 24 }}>
          <Link href="/" passHref>
            <button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <Image src="/arrow.png" alt="Back" width={40} height={40} />
            </button>
          </Link>
          
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Image src="/Icon.png" alt="Exams Icon" width={20} height={20} />
            <span
              className="font-bricolage"
              style={{
                fontWeight: 600,
                fontSize: 16,
                lineHeight: "19px",
                letterSpacing: "-0.04em",
                color: "#A9A9A9",
              }}
            >
              Exams
            </span>
          </div>
        </div>
        
        {/* Mobile Logo Title */}
        <div className="mobile-only" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/" passHref>
            <button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <Image src="/arrow.png" alt="Back" width={40} height={40} />
            </button>
          </Link>
          <Image
            src="/Component 1.png"
            alt="VedaAI Logo"
            width={24}
            height={24}
            style={{ borderRadius: 8 }}
          />
          <span
            className="font-bricolage"
            style={{
              fontWeight: 700,
              fontSize: 20,
              lineHeight: "28px",
              letterSpacing: "-0.06em",
              color: "#303030",
            }}
          >
            VedaAI
          </span>
        </div>
      </div>

      {/* Right Section: Help, Bell, Sparkle, Avatar, Menu */}
      <div
        className="topbar-right-section"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Help Button (Desktop Only) */}
        <button
          className="desktop-only"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 36,
            height: 36,
            background: "transparent",
            borderRadius: 100,
            border: "none",
            cursor: "pointer",
          }}
        >
          <Image src="/q.png" alt="Help" width={36} height={36} />
        </button>

        {/* Bell / Notifications */}
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 36,
            height: 36,
            background: "#F6F6F6",
            borderRadius: 100,
            border: "none",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <Image src="/bell.png" alt="Notifications" width={24} height={24} />
        </button>

        {/* Sparkle Button (Desktop Only) */}
        <button
          className="desktop-only"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 36,
            height: 36,
            background: "transparent",
            borderRadius: 100,
            border: "none",
            cursor: "pointer",
          }}
        >
          <Image src="/ai.png" alt="Sparkle" width={36} height={36} />
        </button>

        {/* User Avatar & Name Dropdown */}
        <div
          className="avatar-container"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "6px 12px",
            gap: 8,
            height: 44,
            borderRadius: 12,
            background: "#FFFFFF",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        >
          {/* Avatar Image */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 32,
              height: 32,
              borderRadius: 100,
              background: "#F6F6F6",
              overflow: "hidden",
            }}
          >
            <Image src="/madhur.jpg" alt="Madhur Rastogi" width={32} height={32} style={{ objectFit: "cover" }} />
          </div>

          {/* Desktop Name & Chevron */}
          <div
            className="mobile-hide-name"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              className="font-bricolage"
              style={{
                fontWeight: 600,
                fontSize: 16,
                color: "#303030",
                whiteSpace: "nowrap",
              }}
            >
              Madhur Rastogi
            </span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        {/* Mobile Hamburger Menu */}
        <button
          className="mobile-only"
          style={{
            display: "none",
            justifyContent: "center",
            alignItems: "center",
            width: 24,
            height: 24,
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
