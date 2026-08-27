"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnswerMapping, BoundingBox, Question, Session } from "@/lib/types";

interface ResultsViewProps {
  session: Session;
  answerSheetFile: File;
}

export default function ResultsView({ session, answerSheetFile }: ResultsViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);
  const [mobileTab, setMobileTab] = useState<"questions" | "answers">("questions");

  const { questions, mappings, totalScore, totalMaxMarks, overallFeedback } = session;

  function getMappingForQuestion(qId: string): AnswerMapping | undefined {
    return mappings.find((m) => m.questionId === qId);
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleExpandAll() {
    if (expandAll) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(questions.map((q) => q.id)));
    }
    setExpandAll(!expandAll);
  }

  function handleSelectQuestion(q: Question) {
    setSelectedId(q.id);
    if (!expandedIds.has(q.id)) toggleExpand(q.id);
  }

  const activeRegions: BoundingBox[] = selectedId
    ? getMappingForQuestion(selectedId)?.regions ?? []
    : [];

  const activePageIndex = activeRegions.length > 0 ? activeRegions[0].pageIndex : 0;

  const scorePercent =
    totalMaxMarks > 0 ? Math.round((totalScore / totalMaxMarks) * 100) : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 12,
        overflow: "hidden",
      }}
    >
      {/* ─── Mobile Tab Toggle ─── */}
      <div
        className="mobile-only"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          maxWidth: 369,
          height: 54,
          margin: "0 auto",
          background: "#F6F6F6",
          borderRadius: 6414,
          padding: 4,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setMobileTab("questions")}
          className="font-bricolage"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: mobileTab === "questions" ? "12px 24px" : "12px 16px",
            gap: 4,
            height: 46,
            borderRadius: 64,
            background: mobileTab === "questions" ? "#303030" : "transparent",
            color: mobileTab === "questions" ? "#FFFFFF" : "rgba(94, 94, 94, 0.8)",
            border: mobileTab === "questions" ? "1px solid #7B7B7B" : "none",
            boxShadow: mobileTab === "questions"
              ? "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 32px 48px rgba(0, 0, 0, 0.2)"
              : "none",
            filter: mobileTab === "questions"
              ? "none"
              : "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) drop-shadow(0px 32px 48px rgba(0, 0, 0, 0.2))",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "140%",
            letterSpacing: "-0.04em",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
        >
          Questions
        </button>
        <button
          onClick={() => setMobileTab("answers")}
          className="font-bricolage"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: mobileTab === "answers" ? "12px 24px" : "12px 16px",
            gap: 4,
            height: 46,
            borderRadius: 64,
            background: mobileTab === "answers" ? "#303030" : "transparent",
            color: mobileTab === "answers" ? "#FFFFFF" : "rgba(94, 94, 94, 0.8)",
            border: mobileTab === "answers" ? "1px solid #7B7B7B" : "none",
            boxShadow: mobileTab === "answers"
              ? "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 32px 48px rgba(0, 0, 0, 0.2)"
              : "none",
            filter: mobileTab === "answers"
              ? "none"
              : "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) drop-shadow(0px 32px 48px rgba(0, 0, 0, 0.2))",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "140%",
            letterSpacing: "-0.04em",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
        >
          Answer Sheet
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, gap: 12, overflow: "hidden" }}>
        {/* ─── Left Panel: Questions ─── */}
        <div
          className={`hide-scrollbar mobile-results-panel ${mobileTab === "answers" ? "desktop-only" : ""}`}
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
            backgroundColor: "#F6F6F6", // Solid light grey to match design
            borderRadius: 24,
            padding: "20px 16px",
            gap: 20,
          }}
        >

          {/* Header + expand all */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              flexShrink: 0,
            }}
          >
            <p
              className="font-bricolage"
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#303030",
                letterSpacing: "-0.04em",
                margin: 0,
              }}
            >
              Extracted Questions <span style={{ fontWeight: 500, color: "#7B7B7B" }}>(from question paper)</span>
            </p>
            <button
              onClick={handleExpandAll}
              className="font-bricolage desktop-only"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                background: "#FFFFFF",
                borderRadius: 100,
                border: "none",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
                fontSize: 14,
                fontWeight: 600,
                color: "#181818",
                cursor: "pointer",
                letterSpacing: "-0.02em",
              }}
            >
              {expandAll ? "Collapse All" : "Expand All"}
            </button>
          </div>

          {/* Question list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flexShrink: 0,
            }}
          >
            {questions.map((q) => {
              const mapping = getMappingForQuestion(q.id);
              const isActive = selectedId === q.id;
              const isExpanded = expandedIds.has(q.id);
              const isAnswered = mapping?.isAnswered !== false;
              const score = mapping?.score ?? 0;
              const maxMarks = mapping?.maxMarks ?? q.maxMarks;
              const scoreGreen = score === maxMarks && maxMarks > 0;

              return (
                <div
                  key={q.id}
                  className="question-item"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 20,
                    gap: 16,
                    background: "#FFFFFF",
                    border: isActive ? "1.5px solid #FF8D36" : "1.5px solid transparent",
                    borderRadius: 20,
                    transition: "all 0.18s ease",
                    cursor: "pointer",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
                  }}
                  onClick={() => handleSelectQuestion(q)}
                >
                  {/* Question row */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      gap: 16,
                    }}
                  >
                    {/* Number badge */}
                    <QuestionBadge number={q.number} isActive={isActive} />

                    {/* Text */}
                    <p
                      className="font-bricolage"
                      style={{
                        flex: 1,
                        fontSize: 16,
                        color: "#181818",
                        lineHeight: "140%",
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        margin: 0,
                      }}
                    >
                      {q.text}
                    </p>

                    {/* Score */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                      <div
                        className="font-bricolage"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "4px 12px",
                          background: isAnswered
                            ? scoreGreen
                              ? "rgba(69, 181, 41, 0.1)"
                              : "rgba(255, 153, 0, 0.1)"
                            : "#FFE9E2",
                          borderRadius: 100,
                          fontSize: 16,
                          fontWeight: 700,
                          lineHeight: "140%",
                          letterSpacing: "-0.04em",
                          color: isAnswered
                            ? scoreGreen
                              ? "#34AC15"
                              : "#E3600F"
                            : "#C0350A",
                        }}
                      >
                        {isAnswered ? score : 0} / {maxMarks}
                      </div>
                      {/* Chevron */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleExpand(q.id); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
                          background: "#F6F6F6",
                          borderRadius: 8,
                          border: "none",
                          cursor: "pointer",
                          color: "#9CA3AF",
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded: answer text + AI feedback */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "0 12px 12px 12px",
                        borderTop: "1px solid #F5F5F5",
                        animation: "fadeInUp 0.2s ease",
                      }}
                    >
                      {!isAnswered ? (
                        <div
                          style={{
                            marginTop: 8,
                            padding: "8px 12px",
                            borderRadius: 8,
                            backgroundColor: "#FEF2F2",
                            border: "1px solid #FECACA",
                            fontSize: 12.5,
                            color: "#B91C1C",
                            fontWeight: 500,
                          }}
                        >
                          ⚠️ Not answered
                        </div>
                      ) : (
                        <>
                          {mapping?.answerText && (
                            <div style={{ marginTop: 4 }}>
                              <p style={{ fontSize: 12, fontWeight: 700, color: "#7B7B7B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                                STUDENT ANSWER
                              </p>
                              <p style={{ fontSize: 14, color: "#303030", lineHeight: 1.6, fontStyle: "italic", fontWeight: 500 }}>
                                &ldquo;{mapping.answerText}&rdquo;
                              </p>
                            </div>
                          )}
                          {mapping?.feedback && (
                            <div
                              style={{
                                marginTop: 16,
                                padding: "16px",
                                borderRadius: 12,
                                backgroundColor: "rgba(255,86,35,0.04)",
                                border: "1px solid rgba(255,86,35,0.2)",
                              }}
                            >
                              <p style={{ fontSize: 12, fontWeight: 800, color: "#FF5623", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
                                AI FEEDBACK
                              </p>
                              <p style={{ fontSize: 14, color: "#181818", lineHeight: 1.6, fontWeight: 400 }}>
                                {mapping.feedback}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Unmatched answers */}
            {session.unmatchedAnswers?.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  padding: "10px 12px",
                  borderRadius: 10,
                  backgroundColor: "#FFFBEB",
                  border: "1.5px solid #FCD34D",
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 600, color: "#92400E", marginBottom: 4 }}>
                  ⚠️ {session.unmatchedAnswers.length} unmatched answer{session.unmatchedAnswers.length > 1 ? "s" : ""} found
                </p>
                <p style={{ fontSize: 12, color: "#A16207" }}>
                  These answers on the sheet couldn&apos;t be matched to any question.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Panel: PDF Viewer ─── */}
        <div
          className={mobileTab === "questions" ? "desktop-only" : ""}
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            backgroundColor: "#F4F4F4",
            borderRadius: 24,
            border: "none",
          }}
        >
          {/* PDF canvas area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <PDFViewer
              file={answerSheetFile}
              activeRegions={activeRegions}
              jumpToPage={activePageIndex}
              selectedQuestionNumber={
                selectedId
                  ? questions.find((q) => q.id === selectedId)?.number
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Question Number Badge ─── */
function QuestionBadge({ number, isActive }: { number: string; isActive: boolean }) {
  const isSubpart = number.includes("(");
  const displayNum = number.replace(/\s*\([a-z]\)/i, "").trim();
  const subpart = number.match(/\(([a-z])\)/i)?.[1]?.toLowerCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        flexShrink: 0,
        marginTop: 1,
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          width: 32,
          height: 32,
          borderRadius: 100,
          background: isActive ? "#FF5623" : "rgba(43, 43, 43, 0.8)",
          border: "2px solid rgba(255, 255, 255, 0.25)",
          boxShadow: isActive
            ? "0px 8px 8.8px rgba(255, 121, 80, 0.1)"
            : "0px 8px 8.8px rgba(134, 134, 134, 0.1), 0px 4px 16px rgba(67, 67, 67, 0.1)",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          transition: "all 0.2s ease",
        }}
      >
        {displayNum}
      </div>
      {isSubpart && subpart && (
        <div
          style={{
            minWidth: 20,
            height: 20,
            borderRadius: 999,
            backgroundColor: isActive ? "rgba(255,86,35,0.15)" : "#F3F4F6",
            color: isActive ? "var(--primary)" : "#6B7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {subpart}.
        </div>
      )}
    </div>
  );
}

/* ─── PDF Viewer with pdfjs-dist ─── */
interface PDFViewerProps {
  file: File;
  activeRegions: BoundingBox[];
  jumpToPage: number;
  selectedQuestionNumber?: string;
}

// Lazy load pdfjs
let pdfjsLib: any = null;
async function loadPdfJs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    // Use CDN worker to avoid bundling issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

function PDFViewer({ file, activeRegions, jumpToPage, selectedQuestionNumber }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [currentPage, setCurrentPage] = useState(1);
  const pdfRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const renderTasksRef = useRef<any[]>([]);

  // Load PDF
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const lib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        canvasRefs.current = new Array(pdf.numPages).fill(null);
        pageRefs.current = new Array(pdf.numPages).fill(null);
      } catch (err) {
        console.error("PDF load error:", err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [file]);

  // Render pages when pdf loaded or zoom changes
  const renderPages = useCallback(async () => {
    if (!pdfRef.current) return;
    // Cancel previous render tasks
    renderTasksRef.current.forEach((t) => t?.cancel?.());
    renderTasksRef.current = [];

    for (let i = 1; i <= pdfRef.current.numPages; i++) {
      try {
        const page = await pdfRef.current.getPage(i);
        const canvas = canvasRefs.current[i - 1];
        if (!canvas) continue;
        const viewport = page.getViewport({ scale: zoom });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        const task = page.render({ canvasContext: ctx, viewport });
        renderTasksRef.current.push(task);
        await task.promise;
      } catch (_) {
        // Cancelled or error — ignore
      }
    }
  }, [zoom, numPages]);

  useEffect(() => {
    if (numPages > 0) renderPages();
  }, [numPages, renderPages]);

  // Jump to page when selection changes
  useEffect(() => {
    const pageEl = pageRefs.current[jumpToPage];
    if (pageEl && containerRef.current) {
      pageEl.scrollIntoView({ behavior: "smooth", block: "center" });
      setCurrentPage(jumpToPage + 1);
    }
  }, [jumpToPage, activeRegions]);

  // Track scroll → update current page indicator
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function onScroll() {
      for (let i = pageRefs.current.length - 1; i >= 0; i--) {
        const el = pageRefs.current[i];
        if (el && el.getBoundingClientRect().top <= container!.getBoundingClientRect().top + 100) {
          setCurrentPage(i + 1);
          break;
        }
      }
    }
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [numPages]);

  function changeZoom(delta: number) {
    setZoom((z) => Math.min(2.5, Math.max(0.5, parseFloat((z + delta).toFixed(1)))));
  }

  if (numPages === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12, color: "#9CA3AF" }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="4" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 12h12M14 18h12M14 24h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: 13 }}>Loading answer sheet…</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Controls bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 20px",
          gap: 10,
          background: "#303030",
          flexShrink: 0,
        }}
      >
        <p
          className="font-bricolage"
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.8)",
            letterSpacing: "-0.04em",
            margin: 0,
          }}
        >
          Answer Sheet
        </p>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          {/* Zoom */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 12px",
              gap: 8,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
            }}
          >
            <span onClick={() => changeZoom(-0.1)} style={{ color: "#FFFFFF", cursor: "pointer", fontSize: 16, fontWeight: 700, lineHeight: 1 }}>-</span>
            <span
              className="font-bricolage"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.04em",
                minWidth: 42,
                textAlign: "center"
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <span onClick={() => changeZoom(0.1)} style={{ color: "#FFFFFF", cursor: "pointer", fontSize: 16, fontWeight: 700, lineHeight: 1 }}>+</span>
          </div>

          {/* Page nav */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 12px",
              gap: 8,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
            }}
          >
            <span
              onClick={() => {
                const newPage = Math.max(1, currentPage - 1);
                setCurrentPage(newPage);
                pageRefs.current[newPage - 1]?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ color: "#A9A9A9", cursor: "pointer", fontSize: 14, fontWeight: 700, lineHeight: 1 }}
            >
              {"<"}
            </span>
            <span
              className="font-bricolage"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.04em",
              }}
            >
              Page {currentPage} of {numPages}
            </span>
            <span
              onClick={() => {
                const newPage = Math.min(numPages, currentPage + 1);
                setCurrentPage(newPage);
                pageRefs.current[newPage - 1]?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ color: "#FFFFFF", cursor: "pointer", fontSize: 14, fontWeight: 700, lineHeight: 1 }}
            >
              {">"}
            </span>
          </div>
        </div>
      </div>

      {/* Pages */}
      <div
        className="hide-scrollbar mobile-results-panel"
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 16,
          gap: 16,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {Array.from({ length: numPages }, (_, i) => {
          const pageRegions = activeRegions.filter((r) => r.pageIndex === i);
          const isActivePage = pageRegions.length > 0;
          return (
            <div
              key={i}
              ref={(el) => { pageRefs.current[i] = el; }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 800,
                background: "white",
                boxShadow: isActivePage
                  ? "0 0 0 2px var(--primary), 0 4px 16px rgba(0,0,0,0.1)"
                  : "0 2px 10px rgba(0,0,0,0.08)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <canvas
                ref={(el) => { canvasRefs.current[i] = el; }}
                style={{ display: "block", width: "100%", height: "auto" }}
              />

              {/* Highlight overlays */}
              {pageRegions.map((region, j) => (
                <div
                  key={j}
                  style={{
                    position: "absolute",
                    left: `${region.x * 100}%`,
                    top: `${region.y * 100}%`,
                    width: `${region.width * 100}%`,
                    height: `${region.height * 100}%`,
                    border: "2px solid #22C55E",
                    backgroundColor: "rgba(34,197,94,0.15)",
                    borderRadius: 3,
                    pointerEvents: "none",
                    animation: "fadeInUp 0.3s ease",
                  }}
                >
                  {/* Label tag */}
                  {selectedQuestionNumber && (
                    <span
                      style={{
                        position: "absolute",
                        top: -22,
                        left: 0,
                        backgroundColor: "#22C55E",
                        color: "white",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "4px 4px 0 0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Q{selectedQuestionNumber}
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const toolbarBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: "1px solid #555",
  backgroundColor: "#3C3C3C",
  color: "#D1D5DB",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1,
};
