/**
 * @fileoverview 現代 DDD Aggregate 基礎類別 (Modern DDD Base Aggregate)
 * @description 聚合根的基礎抽象類，實現聚合根模式和領域事件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Shared Layer Base Aggregate
 * - 職責：聚合根基礎抽象實現
 * - 依賴：ModernBaseEntity, Result 類型
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

import { Result } from '../../result/result';
import { ModernBaseEntity } from '../entities/modern-base-entity';

export interface DomainEvent {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly eventData: any;
}

export abstract class BaseAggregate<Props> extends ModernBaseEntity<Props> {
  private readonly _events: DomainEvent[] = [];

  protected constructor(props: Props) {
    super(props);
  }

  /**
   * 靜態工廠方法，用於創建聚合實例
   * 子類必須實現此方法
   */
  abstract static create(props: any): Result<BaseAggregate<any>>;

  /**
   * 驗證屬性是否有效
   * 子類必須實現此方法
   */
  abstract static isValidProps(props: any): boolean;

  /**
   * 獲取所有領域事件
   */
  get events(): ReadonlyArray<DomainEvent> {
    return [...this._events];
  }

  /**
   * 添加領域事件
   */
  protected addEvent(eventName: string, eventData: any): void {
    const event: DomainEvent = {
      eventName,
      aggregateId: this.id,
      occurredOn: new Date(),
      eventData
    };
    this._events.push(event);
  }

  /**
   * 添加領域事件（使用事件物件）
   */
  protected addEventObject(event: DomainEvent): void {
    this._events.push(event);
  }

  /**
   * 清除所有事件
   */
  clearEvents(): void {
    this._events.length = 0;
  }

  /**
   * 檢查是否有未處理的事件
   */
  hasEvents(): boolean {
    return this._events.length > 0;
  }

  /**
   * 獲取事件數量
   */
  get eventCount(): number {
    return this._events.length;
  }

  /**
   * 克隆聚合（包含事件）
   */
  clone(): BaseAggregate<Props> {
    const cloned = super.clone() as BaseAggregate<Props>;
    (cloned as any)._events = [...this._events];
    return cloned;
  }

  /**
   * 將聚合轉換為普通物件（包含事件）
   */
  toObject(): Props & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    events: DomainEvent[];
  } {
    return {
      ...super.toObject(),
      events: this.events
    };
  }
}

