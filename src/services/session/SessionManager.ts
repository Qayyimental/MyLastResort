import { randomBytes } from 'crypto';
import { FinancialError } from '../../utils/error-handling';
import { createLogger } from '../../utils/logger';

interface Session {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  data: Record<string, any>;
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly logger = createLogger('session-manager');

  createSession(userId: string): Session {
    if (!userId) {
      throw new FinancialError('User ID is required', 'SESSION_ERROR');
    }
    const sessionId = randomBytes(32).toString('hex');
    const session: Session = {
      id: sessionId,
      userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.SESSION_DURATION),
      data: {}
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): Session | undefined {
    if (!sessionId) {
      throw new FinancialError('Session ID is required', 'SESSION_ERROR');
    }
    const session = this.sessions.get(sessionId);
    if (!session) {
      this.logger.warn('Session not found', { sessionId });
      return undefined;
    }
    if (session && new Date() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return undefined;
    }
    return session;
  }

  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  validateSession(session: Session): boolean {
    if (!session || !session.id || !session.userId) {
      return false;
    }
    if (new Date() > session.expiresAt) {
      this.destroySession(session.id);
      return false;
    }
    return true;
  }

  public refreshSession(sessionId: string): Session | undefined {
    const session = this.getSession(sessionId);
    if (session) {
      session.expiresAt = new Date(Date.now() + this.SESSION_DURATION);
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  public cleanExpiredSessions(): void {
    const now = new Date();
    for (const [id, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
      }
    }
  }
}
