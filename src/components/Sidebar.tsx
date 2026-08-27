"use client";

import Image from "next/image";
import Link from "next/link";

interface SidebarProps {
  collapsed?: boolean;
  activeItem?: string;
}

export default function Sidebar({ collapsed = false, activeItem = "exams" }: SidebarProps) {
  return (
    <aside
      className={`desktop-only ${collapsed ? "collapsed" : ""}`}
      style={{
        position: "fixed",
        top: 11,
        left: 10,
        width: collapsed ? 64 : 304,
        height: "calc(100vh - 24px)",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 16px 48px rgba(0, 0, 0, 0.12), 0px 32px 48px rgba(0, 0, 0, 0.2)",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: collapsed ? "12px 0px" : "24px",
        gap: 32,
        boxSizing: "border-box",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* Frame 39962 (Top block) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 56,
          width: collapsed ? 44 : 251,
          height: collapsed ? 414 : 418,
          margin: "0 auto",
        }}
      >
        {/* Logo Header (Frame 1618872393) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: collapsed ? "center" : "space-between",
            alignItems: "center",
            width: "100%",
            height: 40,
            gap: 8,
          }}
        >
          {/* Logo + Text */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image
              src="/Component 1.png"
              alt="VedaAI Logo"
              width={40}
              height={40}
              style={{ borderRadius: 12 }}
            />
            {/* VedaAI */}
            {!collapsed && (
              <span
                className="font-bricolage"
                style={{
                  fontWeight: 700,
                  fontSize: 28,
                  lineHeight: "20px",
                  letterSpacing: "-0.06em",
                  color: "#303030",
                }}
              >
                VedaAI
              </span>
            )}
          </div>
          {/* Expand/Collapse icon */}
          {!collapsed && (
            <div style={{ position: "relative", width: 20, height: 20 }}>
              <Image src="/Frame.png" alt="Toggle" fill style={{ objectFit: "contain" }} />
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: collapsed ? "0px" : "8px 43px",
            gap: 10,
            width: collapsed ? 44 : 251,
            height: 42,
            background: "linear-gradient(#272727, #272727) padding-box, linear-gradient(180deg, #FF7950 0%, #C0350A 100%) border-box",
            boxShadow: "0px 32px 48px 0px #FFFFFF33, 0px 16px 48px 0px #FFFFFF1F, inset 0px 0px 34.5px 0px #FFFFFF40, inset 0px -1px 3.5px 0px #B1B1B199",
            borderRadius: 100,
            border: "4px solid transparent",
            cursor: "pointer",
          }}
        >
          {/* Sparkle icon */}
          <div style={{ position: "relative", width: 22, height: 22, flexShrink: 0 }}>
            <Image src="/Icon Container.png" alt="AI Tool" fill style={{ objectFit: "contain" }} />
          </div>
          {!collapsed && (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 16,
                color: "#FFFFFF",
                letterSpacing: "-0.04em",
                whiteSpace: "nowrap",
              }}
            >
              AI Teacher&apos;s Toolkit
            </span>
          )}
        </button>

        {/* Navigation Menu */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 8, width: collapsed ? 44 : 251 }}>
          <NavItem id="home" label="Home" icon={HomeIcon} isActive={activeItem === "home"} collapsed={collapsed} />
          <NavItem
            id="classroom"
            label="My Classroom"
            icon={ClassroomIcon}
            isActive={activeItem === "classroom"}
            collapsed={collapsed}
          />
          <NavItem
            id="assignments"
            label="Assignments"
            icon={AssignmentsIcon}
            isActive={activeItem === "assignments"}
            collapsed={collapsed}
          />
          <NavItem id="exams" label="Exams" icon={ExamsIcon} isActive={activeItem === "exams"} collapsed={collapsed} />
          <NavItem
            id="library"
            label="My Library"
            icon={LibraryIcon}
            isActive={activeItem === "library"}
            collapsed={collapsed}
          />
        </nav>
      </div>

      {/* Bottom block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          width: collapsed ? 48 : 256,
          height: collapsed ? "auto" : 130,
        }}
      >
        {!collapsed && (
          <NavItem id="settings" label="Settings" icon={SettingsIcon} isActive={activeItem === "settings"} collapsed={collapsed} />
        )}

        {/* School Card */}
        {collapsed ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 4,
              gap: 12,
              width: 48,
              background: "#F6F6F6",
              borderRadius: 16,
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
                background: "#FFFFFF",
                borderRadius: 12,
              }}
            >
              <div style={{ position: "relative", width: 32, height: 32 }}>
                <Image src="/delhi.png" alt="DPS Logo" fill style={{ objectFit: "contain" }} />
              </div>
            </div>
            <div style={{ position: "relative", width: 16, height: 16, marginBottom: 8 }}>
              <Image src="/Chevrons right.png" alt="Expand" fill style={{ objectFit: "contain" }} />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "8px 12px 8px 8px",
              gap: 16,
              width: 254,
              height: 60,
              background: "#F6F6F6",
              borderRadius: 12,
              boxSizing: "border-box",
            }}
          >
            {/* Delhi Public School Logo */}
            <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
              <Image src="/delhi.png" alt="DPS Logo" fill style={{ objectFit: "contain" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <span
                className="font-bricolage"
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: "-0.04em",
                  color: "#303030",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Delhi Public School
              </span>
              <span
                className="font-bricolage"
                style={{
                  fontWeight: 400,
                  fontSize: 14,
                  letterSpacing: "-0.04em",
                  color: "#5E5E5E",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Bokaro Steel City
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({ id, label, icon: Icon, isActive, collapsed = false }: { id: string; label: string; icon: any; isActive: boolean; collapsed?: boolean }) {
  return (
    <Link
      href="#"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "8px" : "9px 12px",
        gap: 8,
        width: "100%",
        height: 38, // Figma says 38px for most, 40px for Exams. We'll use 38.
        background: isActive ? "#F0F0F0" : "transparent",
        borderRadius: 8,
        textDecoration: "none",
      }}
    >
      <Icon isActive={isActive} />
      {!collapsed && (
        <span
          className="font-bricolage"
          style={{
            fontWeight: isActive ? 500 : 400,
            fontSize: 16,
            letterSpacing: "-0.04em",
            color: isActive ? "#303030" : "rgba(94, 94, 94, 0.8)",
          }}
        >
          {label}
        </span>
      )}
    </Link>
  );
}

// Icons matching exact Figma spec measurements
const HomeIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <div style={{ position: "relative", width: 20, height: 20 }}>
      <Image src="/home.png" alt="Home" fill style={{ objectFit: "contain" }} />
    </div>
  );
};

const ClassroomIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <div style={{ position: "relative", width: 20, height: 20 }}>
      <Image src="/class.png" alt="Classroom" fill style={{ objectFit: "contain" }} />
    </div>
  );
};

const AssignmentsIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <div style={{ position: "relative", width: 20, height: 20 }}>
      <Image src="/assign.png" alt="Assignments" fill style={{ objectFit: "contain" }} />
    </div>
  );
};

const ExamsIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <div style={{ position: "relative", width: 20, height: 20 }}>
      <Image src="/Icon.png" alt="Exams" fill style={{ objectFit: "contain" }} />
    </div>
  );
};

const LibraryIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <div style={{ position: "relative", width: 20, height: 20 }}>
      <Image src="/lib.png" alt="Library" fill style={{ objectFit: "contain" }} />
    </div>
  );
};

const SettingsIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <div style={{ position: "relative", width: 20, height: 20 }}>
      <Image src="/Setting.png" alt="Settings" fill style={{ objectFit: "contain" }} />
    </div>
  );
};
