import { Session } from './types';

/** In-memory store – resets on server restart. Sufficient for demo/assignment. */
const sessions = new Map<string, Session>();

export function createSession(id: string): Session {
  const session: Session = {
    id,
    status: 'processing',
    questions: [],
    mappings: [],
    unmatchedAnswers: [],
    answerSheetPages: [],
    totalScore: 0,
    totalMaxMarks: 0,
    overallFeedback: '',
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, updates: Partial<Session>): void {
  const session = sessions.get(id);
  if (session) {
    Object.assign(session, updates);
  }
}
