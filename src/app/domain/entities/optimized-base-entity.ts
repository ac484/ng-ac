/**
 * 優化的基礎實體類別
 * 簡化設計，移除過度的抽象，支援直接屬性存取
 */

/**
 * 基礎實體資料介面
 * 所有實體都應該包含這些基本屬性
 */
export interface BaseEntityData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 簡化的基礎實體類別
 * 使用直接屬性存取，減少 getter/setter 的複雜性
 */
export abstract class OptimizedBaseEntity implements BaseEntityData {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: BaseEntityData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * 更新實體的 updatedAt 時間戳
   */
  public touch(): void {
    this.updatedAt = new Date();
  }

  /**
   * 比較兩個實體是否相等（基於 ID）
   */
  equals(other: OptimizedBaseEntity): boolean {
    if (!other) return false;
    return this.id === other.id;
  }

  /**
   * 獲取實體的基本資料
   */
  getBaseData(): BaseEntityData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 驗證實體的基本屬性
   */
  protected validateBase(): string[] {
    const errors: string[] = [];

    if (!this.id || this.id.trim() === '') {
      errors.push('ID 不能為空');
    }

    if (!this.createdAt) {
      errors.push('創建時間不能為空');
    }

    if (!this.updatedAt) {
      errors.push('更新時間不能為空');
    }

    if (this.createdAt && this.updatedAt && this.createdAt > this.updatedAt) {
      errors.push('創建時間不能晚於更新時間');
    }

    return errors;
  }

  /**
   * 抽象方法：子類別必須實作自己的驗證邏輯
   */
  abstract validate(): { isValid: boolean; errors: string[] };

  /**
   * 將實體轉換為 JSON 物件（用於序列化）
   */
  toJSON(): any {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}

/**
 * 聚合根基礎類別
 * 支援領域事件，但保持簡化設計
 */
export abstract class OptimizedAggregateRoot extends OptimizedBaseEntity {
  private _domainEvents: any[] = [];

  constructor(data: BaseEntityData) {
    super(data);
  }

  /**
   * 添加領域事件
   */
  protected addDomainEvent(event: any): void {
    this._domainEvents.push(event);
  }

  /**
   * 獲取所有領域事件
   */
  getDomainEvents(): any[] {
    return [...this._domainEvents];
  }

  /**
   * 清除所有領域事件
   */
  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * 檢查是否有領域事件
   */
  hasDomainEvents(): boolean {
    return this._domainEvents.length > 0;
  }

  /**
   * 獲取領域事件數量
   */
  getDomainEventCount(): number {
    return this._domainEvents.length;
  }
}

/**
 * 工具函數：生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 工具函數：創建實體資料
 */
export function createEntityData(id?: string): BaseEntityData {
  const now = new Date();
  return {
    id: id || generateId(),
    createdAt: now,
    updatedAt: now
  };
}
