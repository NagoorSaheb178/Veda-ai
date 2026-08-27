import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { AnswerMapping, Question, Session, UnmatchedAnswer } from "@/lib/types";

export const maxDuration = 120; // 2 minutes timeout for AI processing

// ─── Helpers ────────────────────────────────────────────────────────────────

function getAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add your key to .env.local"
    );
  }
  return new GoogleGenAI({ apiKey: key });
}

async function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  const buf = await file.arrayBuffer();
  const data = Buffer.from(buf).toString("base64");
  const mimeType = file.type || "application/pdf";
  return { data, mimeType };
}

async function generateContentWithRetry(ai: GoogleGenAI, request: any, maxRetries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(request);
    } catch (err: any) {
      lastError = err;
      const isNetworkError = err?.cause?.code === "ECONNRESET" || err?.message?.includes("fetch failed");
      if (isNetworkError && attempt < maxRetries) {
        console.warn(`[VedaAI] Network error (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in 2s...`);
        await new Promise((res) => setTimeout(res, 2000));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

function tryParseJson<T>(text: string, fallback: T): T {
  try {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/^```(?:json)?\s*/im, "")
      .replace(/\s*```\s*$/im, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    console.error("JSON parse failed. Raw response:", text?.slice(0, 500));
    return fallback;
  }
}

// ─── Step 1: Extract Questions ───────────────────────────────────────────────

async function extractQuestions(
  ai: GoogleGenAI,
  qpData: string,
  qpMime: string
): Promise<Question[]> {
  const prompt = `You are an expert exam question extractor.

Analyze the provided question paper and extract ALL questions in the EXACT printed order.

CRITICAL RULES:
1. Treat labeled sub-parts as SEPARATE questions.
   Example: "11 (a)" and "11 (b)" → two separate entries with numbers "11 (a)" and "11 (b)".
2. Preserve the original question numbering exactly (e.g., "1", "2", "11 (a)", "11 (b)").
3. Extract maximum marks for each question. Look for patterns like "[2 marks]", "(5)", "Max: 3", etc.
   If not visible, estimate based on question complexity (short answer=2, long=5, diagram=3).
4. Include the COMPLETE question text, including any sub-text or figure references.

Return a JSON ARRAY only — no markdown, no explanation, no code fences:
[
  {
    "id": "q1",
    "number": "1",
    "text": "Full question text here",
    "maxMarks": 2
  }
]`;

  const response = await generateContentWithRetry(ai, {
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: qpMime, data: qpData } },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const text = response.text ?? "[]";
  const raw = tryParseJson<any[]>(text, []);

  return raw.map((item: any, idx: number) => ({
    id: item.id ?? `q${idx + 1}`,
    number: String(item.number ?? idx + 1),
    text: String(item.text ?? ""),
    maxMarks: Number(item.maxMarks ?? 2),
  }));
}

// ─── Step 2: Map Answers ─────────────────────────────────────────────────────

interface RawMapping {
  questionId: string;
  answerText: string;
  regions: Array<{
    pageIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  isAnswered: boolean;
}

interface RawMappingResult {
  mappings: RawMapping[];
  unmatchedAnswers: Array<{ text: string; regions: RawMapping["regions"] }>;
}

async function mapAnswers(
  ai: GoogleGenAI,
  asData: string,
  asMime: string,
  questions: Question[]
): Promise<RawMappingResult> {
  const questionsList = questions
    .map((q) => `  - ID: ${q.id} | Number: ${q.number} | "${q.text}"`)
    .join("\n");

  const prompt = `You are an expert at reading handwritten student answer sheets.

The following questions were on the exam:
${questionsList}

Analyze this student answer sheet and for each question above:
1. Find where the student answered it (answers may be in ANY order — students often answer out of sequence).
2. Transcribe the answer text.
3. Identify the EXACT bounding box of the answer on the page using NORMALIZED coordinates (0.0 to 1.0 relative to page dimensions).
   - x, y = top-left corner of the answer region
   - width, height = dimensions of the region
4. Specify which page the answer is on (0-indexed).
5. If a question was NOT answered, set isAnswered: false and regions: [].
6. If an answer exists on the sheet but doesn't match any question, add it to unmatchedAnswers.

Return JSON ONLY — no markdown, no code fences:
{
  "mappings": [
    {
      "questionId": "q1",
      "answerText": "transcribed student answer",
      "regions": [
        { "pageIndex": 0, "x": 0.05, "y": 0.08, "width": 0.90, "height": 0.18 }
      ],
      "isAnswered": true
    }
  ],
  "unmatchedAnswers": [
    {
      "text": "answer text that doesn't match any question",
      "regions": [{ "pageIndex": 0, "x": 0.0, "y": 0.9, "width": 1.0, "height": 0.08 }]
    }
  ]
}`;

  const response = await generateContentWithRetry(ai, {
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: asMime, data: asData } },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const text = response.text ?? "{}";
  const raw = tryParseJson<Partial<RawMappingResult>>(text, {
    mappings: [],
    unmatchedAnswers: [],
  });

  return {
    mappings: Array.isArray(raw.mappings) ? raw.mappings : [],
    unmatchedAnswers: Array.isArray(raw.unmatchedAnswers) ? raw.unmatchedAnswers : [],
  };
}

// ─── Step 3: Grade & Feedback ────────────────────────────────────────────────

interface RawGrade {
  questionId: string;
  score: number;
  feedback: string;
}

interface RawGradingResult {
  grades: RawGrade[];
  overallFeedback: string;
}

async function gradeAnswers(
  ai: GoogleGenAI,
  questions: Question[],
  mappings: RawMapping[]
): Promise<RawGradingResult> {
  const qa = questions.map((q) => {
    const m = mappings.find((mp) => mp.questionId === q.id);
    return {
      questionId: q.id,
      number: q.number,
      question: q.text,
      maxMarks: q.maxMarks,
      studentAnswer: m?.isAnswered ? m.answerText : "[NOT ANSWERED]",
    };
  });

  const prompt = `You are an experienced teacher grading student answers.

Grade each student answer below. Be fair, accurate, and constructive.

${JSON.stringify(qa, null, 2)}

For each question:
1. Assign a score from 0 to maxMarks (use whole or half marks).
2. Write 1–2 sentences of specific, constructive feedback.
3. For unanswered questions (marked [NOT ANSWERED]), assign score 0 with brief feedback.

Also write an overall feedback paragraph (2–3 sentences) summarizing the student's performance.

Return JSON ONLY — no markdown, no code fences:
{
  "grades": [
    {
      "questionId": "q1",
      "score": 2,
      "feedback": "Excellent! You correctly explained the concept with good detail."
    }
  ],
  "overallFeedback": "The student has demonstrated a good understanding overall..."
}`;

  const response = await generateContentWithRetry(ai, {
    model: "gemini-3.6-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const text = response.text ?? "{}";
  const raw = tryParseJson<Partial<RawGradingResult>>(text, {
    grades: [],
    overallFeedback: "",
  });

  return {
    grades: Array.isArray(raw.grades) ? raw.grades : [],
    overallFeedback: String(raw.overallFeedback ?? ""),
  };
}

// ─── POST Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // 1. Parse form data
    const formData = await request.formData();
    const questionPaperFile = formData.get("questionPaper") as File | null;
    const answerSheetFile = formData.get("answerSheet") as File | null;

    if (!questionPaperFile || !answerSheetFile) {
      return NextResponse.json(
        { error: "Both questionPaper and answerSheet files are required." },
        { status: 400 }
      );
    }

    // 2. Convert files to base64
    const [qp, as_] = await Promise.all([
      fileToBase64(questionPaperFile),
      fileToBase64(answerSheetFile),
    ]);

    // 3. Init AI
    const ai = getAI();

    // 4. Extract questions from question paper
    console.log("[VedaAI] Extracting questions...");
    const questions = await extractQuestions(ai, qp.data, qp.mimeType);
    console.log(`[VedaAI] Extracted ${questions.length} questions`);

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Could not extract any questions from the question paper. Please check the file." },
        { status: 422 }
      );
    }

    // 5. Map answers
    console.log("[VedaAI] Mapping answers...");
    const { mappings: rawMappings, unmatchedAnswers: rawUnmatched } =
      await mapAnswers(ai, as_.data, as_.mimeType, questions);
    console.log(`[VedaAI] Mapped ${rawMappings.length} answers`);

    // 6. Grade & feedback
    console.log("[VedaAI] Grading...");
    const { grades, overallFeedback } = await gradeAnswers(
      ai,
      questions,
      rawMappings
    );
    console.log("[VedaAI] Grading complete");

    // 7. Assemble full answer mappings
    const mappings: AnswerMapping[] = questions.map((q) => {
      const rawMap = rawMappings.find((m) => m.questionId === q.id);
      const grade = grades.find((g) => g.questionId === q.id);
      const isAnswered = rawMap?.isAnswered !== false;
      const score = grade?.score ?? 0;
      const clampedScore = Math.min(score, q.maxMarks);

      return {
        questionId: q.id,
        answerText: rawMap?.answerText ?? "",
        regions: (rawMap?.regions ?? []).map((r) => ({
          pageIndex: r.pageIndex ?? 0,
          x: clamp(r.x ?? 0, 0, 1),
          y: clamp(r.y ?? 0, 0, 1),
          width: clamp(r.width ?? 0.9, 0, 1),
          height: clamp(r.height ?? 0.1, 0, 1),
        })),
        score: isAnswered ? clampedScore : 0,
        maxMarks: q.maxMarks,
        isCorrect: isAnswered ? clampedScore === q.maxMarks : false,
        feedback: grade?.feedback ?? "",
        isAnswered,
      };
    });

    const unmatchedAnswers: UnmatchedAnswer[] = rawUnmatched.map((u) => ({
      text: u.text,
      regions: (u.regions ?? []).map((r) => ({
        pageIndex: r.pageIndex ?? 0,
        x: clamp(r.x ?? 0, 0, 1),
        y: clamp(r.y ?? 0, 0, 1),
        width: clamp(r.width ?? 0.9, 0, 1),
        height: clamp(r.height ?? 0.1, 0, 1),
      })),
    }));

    const totalScore = mappings.reduce((sum, m) => sum + m.score, 0);
    const totalMaxMarks = questions.reduce((sum, q) => sum + q.maxMarks, 0);

    const session: Session = {
      id: `session_${Date.now()}`,
      status: "done",
      questions,
      mappings,
      unmatchedAnswers,
      answerSheetPages: [], // client renders from File directly
      totalScore,
      totalMaxMarks,
      overallFeedback,
    };

    return NextResponse.json(session);
  } catch (err: any) {
    console.error("[VedaAI] Process error:", err);
    return NextResponse.json(
      {
        error: err?.message ?? "An unexpected error occurred during processing.",
      },
      { status: 500 }
    );
  }
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}
