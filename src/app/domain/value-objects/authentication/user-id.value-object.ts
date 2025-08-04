/**
 * 使用者系統內部 ID 值物件
 */
export class UserId {
  private readonly value: string;

  constructor(id: string) {
    if (!id || id.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
    this.value = id.trim();
  }

  getValue(): string {
    return this.value;
  }

  static generate(): UserId {
    return new UserId(`user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
  }
}
