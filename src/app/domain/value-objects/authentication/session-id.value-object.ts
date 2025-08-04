/**
 * 當前登入會話 ID 值物件
 */
export class SessionId {
  private readonly value: string;

  constructor(sessionId: string) {
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('Session ID cannot be empty');
    }
    this.value = sessionId.trim();
  }

  getValue(): string {
    return this.value;
  }

  static generate(): SessionId {
    return new SessionId(`session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
  }
} 