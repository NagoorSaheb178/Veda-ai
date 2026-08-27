export interface BoundingBox {
  /** Normalized 0–1 values relative to image width/height */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Page index (0-based) */
  pageIndex: number;
}

export interface Question {
  id: string;
  /** Display number, e.g. "1", "11 (a)", "11 (b)" */
  number: string;
  text: string;
  maxMarks: number;
}

export interface AnswerMapping {
  questionId: string;
  answerText: string;
  /** Which pages + regions the answer spans */
  regions: BoundingBox[];
  /** Grading */
  score: number;
  maxMarks: number;
  isCorrect: boolean | null;
  feedback: string;
  isAnswered: boolean;
}

export interface UnmatchedAnswer {
  text: string;
  regions: BoundingBox[];
}

export type SessionStatus = "processing" | "done" | "error";

export interface Session {
  id: string;
  status: SessionStatus;
  error?: string;
  questions: Question[];
  mappings: AnswerMapping[];
  unmatchedAnswers: UnmatchedAnswer[];
  /** Base64 data URIs for each answer sheet page image */
  answerSheetPages: string[];
  totalScore: number;
  totalMaxMarks: number;
  overallFeedback: string;
}
