"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface UploadPageProps {
  onSubmit: (questionPaper: File, answerSheet: File) => void;
  error?: string | null;
}

interface FileInfo {
  file: File;
}

export default function UploadPage({ onSubmit, error }: UploadPageProps) {
  const [questionPaper, setQuestionPaper] = useState<FileInfo | null>(null);
  const [answerSheet, setAnswerSheet] = useState<FileInfo | null>(null);

  const qpInputRef = useRef<HTMLInputElement>(null);
  const asInputRef = useRef<HTMLInputElement>(null);

  const bothReady = questionPaper !== null && answerSheet !== null;

  function handleFile(file: File, setter: (info: FileInfo | null) => void) {
    if (!file) return;
    setter({ file });
  }

  function handleDrop(e: React.DragEvent, setter: (info: FileInfo | null) => void) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, setter);
  }

  function handleSubmit() {
    if (questionPaper && answerSheet) onSubmit(questionPaper.file, answerSheet.file);
  }

  return (
    /* Frame 1984077325 — 1103×694, flex-col, center, gap:36, border-radius:40 */
    <div
      className="mobile-upload-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: 1103,
        maxWidth: "100%",
        gap: 36,
      }}
    >
      {/* Frame 1984078310 — 789×475, flex-col, center, gap:20 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          marginTop: 40,
        }}
      >
        {/* Frame 1984078307 — 755×92, flex-col, center, gap:8 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            width: 755,
            maxWidth: "100%",
          }}
        >
          {/* Desktop Heading: Frame 1984078197 — 755×56, flex-row, center, gap:12 */}
          <div
            className="desktop-only"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              width: 755,
              height: 56,
              maxWidth: "100%",
            }}
          >
            {/* "Upload" — 130×48, 40px, fw700, #2B2B2B */}
            <span
              className="font-bricolage"
              style={{
                fontSize: 40,
                fontWeight: 700,
                lineHeight: "120%",
                letterSpacing: "-0.04em",
                color: "#2B2B2B",
                whiteSpace: "nowrap",
              }}
            >
              Upload
            </span>

            {/* Frame 1984078306 — orange pill, 613×56, padding:4px 8px, bg rgba(255,147,80,0.15), border-radius:8 */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "4px 8px",
                gap: 10,
                background: "rgba(255, 147, 80, 0.15)",
                borderRadius: 8,
                height: 56,
              }}
            >
              <span
                className="font-bricolage"
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  lineHeight: "120%",
                  letterSpacing: "-0.04em",
                  color: "#FF5623",
                  whiteSpace: "nowrap",
                }}
              >
                Question Paper &amp; Answer Sheets
              </span>
            </div>
          </div>

          {/* Mobile Heading */}
          <div className="mobile-only" style={{ width: "100%", justifyContent: "center" }}>
            <span
              className="font-bricolage"
              style={{
                fontSize: 24,
                fontWeight: 700,
                lineHeight: "120%",
                letterSpacing: "-0.04em",
                color: "#2B2B2B",
                textAlign: "center",
                whiteSpace: "pre-line",
              }}
            >
              Upload Question Paper{"\n"}&amp; Answer Sheets
            </span>
          </div>

          {/* "Upload both files to get started" — 269×28, 20px, fw400, #303030 */}
          <p
            className="font-bricolage desktop-only"
            style={{
              fontSize: 20,
              fontWeight: 400,
              lineHeight: "140%",
              letterSpacing: "-0.04em",
              color: "#303030",
              textAlign: "center",
              width: 269,
              height: 28,
              margin: 0,
            }}
          >
            Upload both files to get started
          </p>
        </div>

        {/* Frame 1618872259 — Teacher avatar 137×138 */}
        <TeacherAvatar />
      </div>

      {/* Upload Section Wrapper */}
      <div
        className="mobile-upload-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          width: 789,
          maxWidth: "100%",
        }}
      >
        {/* Grey Box */}
        <div
          className="mobile-upload-grey-box"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 12,
            gap: 24,
            width: "100%",
            height: 205,
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: 24,
          }}
        >
          {/* Inner Card Box */}
          <div
            className="mobile-upload-inner-box"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              width: "100%",
            }}
          >
            <UploadCard
              id="question-paper-upload"
              label="Question Paper"
              fileInfo={questionPaper}
              onFileSelect={(f) => handleFile(f, setQuestionPaper)}
              onClear={() => setQuestionPaper(null)}
              onDrop={(e) => handleDrop(e, setQuestionPaper)}
              inputRef={qpInputRef}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
            />
            <UploadCard
              id="answer-sheet-upload"
              label="Answer Sheet"
              fileInfo={answerSheet}
              onFileSelect={(f) => handleFile(f, setAnswerSheet)}
              onClear={() => setAnswerSheet(null)}
              onDrop={(e) => handleDrop(e, setAnswerSheet)}
              inputRef={asInputRef}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            fontSize: 13,
            textAlign: "center",
            width: 410,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Frame 1984078309 — 410×78, flex-col, center, gap:12 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          width: 410,
          height: 78,
        }}
      >
        {/* Primary Button Dark — 161×44, border-radius:64, padding:12px 20px 12px 24px */}
        <button
          id="start-mapping-btn"
          onClick={handleSubmit}
          disabled={!bothReady}
          className="font-bricolage"
          style={{
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "12px 20px 12px 24px",
            gap: 8,
            width: 161,
            height: 44,
            background: "#303030",
            opacity: bothReady ? 1 : 0.25,
            border: "2px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 64,
            cursor: bothReady ? "pointer" : "not-allowed",
            transition: "opacity 0.2s",
          }}
        >
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "1",
              letterSpacing: "-0.04em",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
            }}
          >
            Start Mapping
          </span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, flexShrink: 0 }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path d="M4.16602 10H15.8327" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.834 5L15.834 10L10.834 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        {/* Subtext — 410×22, 14px, fw400, ls -0.06em */}
        <p
          className="font-bricolage"
          style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: "-0.06em",
            color: "rgba(94, 94, 94, 0.8)",
            textAlign: "center",
            width: 410,
            height: 22,
            margin: 0,
          }}
        >
          Once both files are uploaded, you&apos;ll able to map answers with questions
        </p>
      </div>
    </div>
  );
}

/* ─── Teacher Avatar (Frame 1618872259) — 137×138 ─── */
function TeacherAvatar() {
  return (
    <div
      style={{
        position: "relative",
        width: 138,
        height: 138,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {/* Base Teacher Avatar Image (Frame 1618872259) */}
      <Image
        src="/Frame 1618872259.png"
        alt="AI Teacher Base"
        width={138}
        height={138}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 1,
          objectFit: "contain",
        }}
      />

      {/* Orbiting dots frame (Frame 1618872257) */}
      <Image
        src="/Frame 1618872257.png"
        alt="Orbiting Elements"
        width={113}
        height={111}
        style={{
          position: "absolute",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ─── Upload Card (Frame 1984078268/9) ─── */
interface UploadCardProps {
  id: string;
  label: string;
  fileInfo: FileInfo | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onDrop: (e: React.DragEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
}

function UploadCard({ id, label, fileInfo, onFileSelect, onClear, onDrop, inputRef, accept }: UploadCardProps) {
  const [dragging, setDragging] = useState(false);

  return (
    /* 374.5×181, bg white, border 1.5px dashed #CECECE, border-radius:20, padding:10 */
    <div
      className="mobile-upload-card"
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        gap: 10,
        flex: 1,
        height: 181,
        background: fileInfo ? "rgba(255,86,35,0.02)" : "#FFFFFF",
        border: `1.5px ${fileInfo ? "solid" : "dashed"} ${fileInfo ? "#FF5623" : dragging ? "#FF5623" : "#CECECE"}`,
        borderRadius: 20,
        cursor: fileInfo ? "default" : "pointer",
        position: "relative",
        transition: "all 0.18s",
      }}
      onClick={() => !fileInfo && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { setDragging(false); onDrop(e); }}
    >
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
          e.target.value = "";
        }}
      />

      {fileInfo ? (
        /* Uploaded state */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            style={{
              position: "absolute", top: 10, right: 10,
              width: 22, height: 22, borderRadius: "50%",
              border: "none", backgroundColor: "#1A1A1A", color: "white",
              cursor: "pointer", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
          {/* Upload icon box — 48×48 */}
          <div style={{
            width: 48, height: 48, background: "#FF562320",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#FF5623" }}>PDF</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <p className="font-bricolage" style={{
              fontSize: 14, fontWeight: 600, letterSpacing: "-0.06em", color: "#303030",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300, margin: 0,
            }}>
              {fileInfo.file.name}
            </p>
            <p style={{ fontSize: 12, color: "rgba(94,94,94,0.55)", letterSpacing: "-0.06em", marginTop: 2 }}>
              {(fileInfo.file.size / 1_000_000).toFixed(1)} MB
            </p>
          </div>
        </div>
      ) : (
        /* Empty state — Frame 1984077924/5 — 198×110, flex-col, center, gap:16 */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 198, height: 110 }}>
          {/* Frame 1984078308 — 48×48, bg #F3F3F3, border-radius:8, padding:4 */}
          <div className="mobile-upload-icon-box" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 48, height: 48, background: "#F3F3F3", borderRadius: 8, padding: 4,
          }}>
            {/* upload icon — 32×32, color #303030 */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 22V12M16 12l-5 5M16 12l5 5" stroke="#303030" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 26h16" stroke="#303030" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          {/* Frame 1618872200 — gap:2 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            {/* Label — 20px, fw600, ls -0.06em */}
            <p className="font-bricolage mobile-upload-label" style={{
              fontSize: 20, fontWeight: 600, lineHeight: "22px",
              letterSpacing: "-0.06em", color: "#303030",
              margin: 0, textAlign: "center", whiteSpace: "nowrap"
            }}>
              Upload{" "}
              <span style={{ color: "#FF5623" }}>{label}</span>
            </p>
            {/* Max 10MB — 14px, fw400, ls -0.06em, rgba(94,94,94,0.55) */}
            <p className="font-bricolage mobile-upload-sublabel" style={{
              fontSize: 14, fontWeight: 400, lineHeight: "22px",
              letterSpacing: "-0.06em", color: "rgba(94, 94, 94, 0.55)",
              margin: 0,
            }}>
              Max 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
