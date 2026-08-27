"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import UploadPage from "@/components/UploadPage";
import ExtractingScreen from "@/components/ExtractingScreen";
import ResultsView from "@/components/ResultsView";
import { Session } from "@/lib/types";

type AppState = "upload" | "processing" | "results";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [session, setSession] = useState<Session | null>(null);
  const [answerSheetFile, setAnswerSheetFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStartMapping(questionPaper: File, answerSheet: File) {
    setError(null);
    setAnswerSheetFile(answerSheet);
    setAppState("processing");

    try {
      const formData = new FormData();
      formData.append("questionPaper", questionPaper);
      formData.append("answerSheet", answerSheet);

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      setSession(data as Session);
      setAppState("results");
    } catch (e: any) {
      console.error("Processing failed:", e);
      setError(e.message ?? "Something went wrong. Please try again.");
      setAppState("upload");
    }
  }

  function handleReset() {
    setSession(null);
    setAnswerSheetFile(null);
    setError(null);
    setAppState("upload");
  }

  const sidebarCollapsed = appState === "processing" || appState === "results";

  return (
    <div
      style={{
        boxSizing: "border-box",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F5F5F5 0%, #E9E5E5 100%)",
        position: "relative",
        overflowX: "hidden", // Fix: Allow vertical scrolling, prevent horizontal scroll
      }}
    >
      {/* Background container to prevent scroll inflation */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Background blurred ellipses from Figma spec */}
        <div
          style={{
            position: "absolute",
            width: 1318,
            height: 428,
            left: "calc(50% - 1318px/2 + 166px)",
            top: "calc(50% - 428px/2 + 499.5px)",
            background: "rgba(23, 23, 23, 0.4)",
            filter: "blur(200px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 1113,
            height: 428,
            left: "calc(50% - 1113px/2 + 158.5px)",
            top: "calc(50% - 428px/2 + 728.5px)",
            background: "rgba(76, 76, 76, 0.4)",
            filter: "blur(200px)",
          }}
        />
      </div>
      {/* Fixed Sidebar */}
      <div className="desktop-only">
        <Sidebar
          collapsed={sidebarCollapsed}
          activeItem="exams"
        />
      </div>

      {/* TopBar (Absolutely positioned) */}
      <TopBar collapsed={sidebarCollapsed} />

      {/* Main content area — offset from sidebar */}
      <div
        className="mobile-w-full"
        style={{
          boxSizing: "border-box",
          marginLeft: sidebarCollapsed ? 86 : 327, // Desktop margin
          paddingTop: appState === "processing" ? 80 : 81, // Desktop top padding
          paddingRight: 12,
          paddingLeft: 12,
          paddingBottom: 12,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Page content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            borderRadius: 40, // border-radius XL = 40px per Figma
            overflow: "visible",
            height: "auto",
          }}
        >
          {appState === "upload" && (
            <UploadPage
              onSubmit={handleStartMapping}
              error={error}
            />
          )}

          {appState === "processing" && (
            <div
              style={{
                flex: 1,
                margin: 0,
                borderRadius: 24,
                overflow: "hidden",
                minHeight: "60vh",
              }}
            >
              <ExtractingScreen />
            </div>
          )}

          {appState === "results" && session && answerSheetFile && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "auto",
              }}
            >
              <ResultsView
                session={session}
                answerSheetFile={answerSheetFile}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
