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
  const [aspectRatios, setAspectRatios] = useState<Record<number, number>>({});

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
        flex: 1,
        minHeight: 0,
        width: "100%",
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
          width: "calc(100% - 32px)",
          maxWidth: 369,
          height: 54,
          margin: "0 auto",
          background: "#F6F6F6",
          borderRadius: 64,
          padding: 4,
          flexShrink: 0,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
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
            padding: "12px 16px",
            gap: 4,
            height: 46,
            borderRadius: 64,
            background: mobileTab === "questions" ? "#303030" : "transparent",
            color: mobileTab === "questions" ? "#FFFFFF" : "rgba(94, 94, 94, 0.8)",
            border: "none",
            boxShadow: mobileTab === "questions"
              ? "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 32px 48px rgba(0, 0, 0, 0.2)"
              : "none",
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
            padding: "12px 16px",
            gap: 4,
            height: 46,
            borderRadius: 64,
            background: mobileTab === "answers" ? "#303030" : "transparent",
            color: mobileTab === "answers" ? "#FFFFFF" : "rgba(94, 94, 94, 0.8)",
            border: "none",
            boxShadow: mobileTab === "answers"
              ? "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 32px 48px rgba(0, 0, 0, 0.2)"
              : "none",
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

      <div style={{ display: "flex", flex: 1, minHeight: 0, gap: 12, overflow: "hidden" }}>
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
            borderRadius: 20,
            padding: "16px 16px 32px 16px", // Increased bottom padding
            gap: 16,
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
            {[...questions].sort((a, b) => {
              const numA = parseInt(a.number) || 0;
              const numB = parseInt(b.number) || 0;
              if (numA !== numB) return numA - numB;
              return a.number.localeCompare(b.number);
            }).map((q) => {
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
            overflow: "hidden", // Keeps the inner scroll contained
            borderRadius: 24,
          }}
        >
          {/* PDF canvas area */}
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

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
      } catch (err) {
        console.error("PDF load error:", err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [file]);

  // Render current page
  const renderPage = useCallback(async () => {
    if (!pdfRef.current || !canvasRef.current) return;
    
    renderTaskRef.current?.cancel?.();
    
    try {
      const page = await pdfRef.current.getPage(currentPage);
      // Render at a fixed high-resolution scale for crispness
      const renderScale = 3.0;
      const viewport = page.getViewport({ scale: renderScale });
      
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      // Allow CSS to control the display size
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const renderTask = page.render({ 
        canvasContext: ctx, 
        viewport: viewport 
      });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
    } catch (err) {
      // Ignored
    }
  }, [currentPage]);

  useEffect(() => {
    renderPage();
  }, [currentPage, renderPage]);

  // Jump to page when selection changes
  useEffect(() => {
    setCurrentPage(jumpToPage + 1);
  }, [jumpToPage]);

  function changeZoom(delta: number) {
    setZoom((z) => Math.min(2.5, Math.max(0.5, parseFloat((z + delta).toFixed(1)))));
  }

  const pageRegions = activeRegions.filter((r) => r.pageIndex === currentPage - 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
        background: "#FFFFFF",
        border: "1.25px solid rgba(0,0,0,0.1)",
        borderRadius: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          background: "#303030",
          borderBottom: "1.25px solid rgba(0,0,0,0.1)",
          flexShrink: 0,
        }}
      >
        <div className="desktop-only" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap" }}>
          Answer Sheet
        </div>
        <div className="answer-sheet-controls" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Zoom controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "7px 10px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#FFFFFF",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            <span
              className="smooth-btn"
              onClick={() => changeZoom(-0.1)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, height: 14 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <line x1="3" y1="8" x2="13" y2="8" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span>{Math.round(zoom * 100)}%</span>
            <span
              className="smooth-btn"
              onClick={() => changeZoom(0.1)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, height: 14 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <line x1="8" y1="3" x2="8" y2="13" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="3" y1="8" x2="13" y2="8" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          {/* Page controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "7px 10px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#FFFFFF",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            <span
              className={`smooth-btn ${currentPage <= 1 ? "disabled" : ""}`}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, height: 14 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <polyline points="10,3 5,8 10,13" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Page {currentPage} of {numPages || 1}</span>
            <span
              className={`smooth-btn ${currentPage >= numPages ? "disabled" : ""}`}
              onClick={() => setCurrentPage((p) => Math.min(numPages || 1, p + 1))}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, height: 14 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <polyline points="6,3 11,8 6,13" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <style>{`
        .pdf-scroll-container::-webkit-scrollbar {
          width: 8px;
        }
        .pdf-scroll-container::-webkit-scrollbar-track {
          background: #FFFFFF;
        }
        .pdf-scroll-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
          border: 2px solid #FFFFFF;
        }
        .smooth-btn {
          transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .smooth-btn:active {
          transform: scale(0.88);
          opacity: 0.8;
        }
        .smooth-btn.disabled {
          opacity: 0.4;
          pointer-events: none;
          transform: none;
        }
        .question-item {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          -webkit-tap-highlight-color: transparent;
        }
        .question-item:active {
          transform: scale(0.985);
        }
      `}</style>
      <div
        className="hide-scrollbar pdf-scroll-container"
        style={{
          flex: 1,
          position: "relative",
          background: "#FFFFFF",
          overflow: "auto",
          padding: 0,
        }}
      >
        {numPages === 0 ? (
          <div style={{ margin: "auto", color: "#9CA3AF", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, height: "100%", justifyContent: "center" }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="4" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 12h12M14 18h12M14 24h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p>Loading answer sheet…</p>
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              background: "white",
              margin: "0 auto",
              width: `${zoom * 100}%`,
              transition: "width 0.2s ease",
            }}
          >
            <canvas ref={canvasRef} style={{ display: "block" }} />

            {/* Highlight overlays */}
            {pageRegions.map((region, j) => (
              <div
                key={j}
                style={{
                  position: "absolute",
                  left: `calc(${region.x * 100}% - 10px)`,
                  top: `calc(${region.y * 100}% - 10px)`,
                  width: `calc(${region.width * 100}% + 20px)`,
                  height: `calc(${region.height * 100}% + 20px)`,
                  boxSizing: "border-box",
                  border: "2px solid #3DD218",
                  backgroundColor: "rgba(94, 255, 53, 0.1)",
                  borderRadius: 16,
                  pointerEvents: "none",
                  animation: "fadeInUp 0.3s ease",
                }}
              >
                {selectedQuestionNumber && (
                  <div
                    style={{
                      position: "absolute",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "2px 12px",
                      height: 28,
                      left: 16,
                      top: -28,
                      backgroundColor: "#3DD218",
                      borderRadius: "8px 8px 0 0",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        lineHeight: "140%",
                        letterSpacing: "-0.04em",
                        color: "#FFFFFF",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Q{selectedQuestionNumber}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
