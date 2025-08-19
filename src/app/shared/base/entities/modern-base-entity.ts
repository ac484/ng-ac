/**
 * @fileoverview 現代 DDD Entity 基礎類別 (Modern DDD Base Entity)
 * @description 實體的基礎抽象類，實現私有構造函數和靜態工廠方法
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Shared Layer Modern Base Entity
 * - 職責：實體基礎抽象實現
 * - 依賴：Result 類型
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

import { Result } from '../../result/result';

export abstract class ModernBaseEntity<Props> {
  protected readonly props: Readonly<Props>;
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly version: number;

  protected constructor(props: Props) {
    this.props = Object.freeze(props);
    this.id = (props as any).id || this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.version = 1;
  }

  /**
   * 靜態工廠方法，用於創建實體實例
   * 子類必須實現此方法
   */
  abstract static create(props: any): Result<ModernBaseEntity<any>>;

  /**
   * 驗證屬性是否有效
   * 子類必須實現此方法
   */
  abstract static isValidProps(props: any): boolean;

  /**
   * 獲取屬性值
   */
  get<Key extends keyof Props>(key: Key): Props[Key] {
    return this.props[key];
  }

  /**
   * 將實體轉換為普通物件
   */
  toObject(): Props & { id: string; createdAt: Date; updatedAt: Date; version: number } {
    return {
      ...this.props,
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version
    };
  }

  /**
   * 比較兩個實體是否相等
   */
  isEqual(other: ModernBaseEntity<Props>): boolean {
    if (this === other) return true;
    if (!other || !(other instanceof ModernBaseEntity)) return false;

    return this.id === other.id;
  }

  /**
   * 克隆實體
   */
  clone(): ModernBaseEntity<Props> {
    return new (this.constructor as any)({ ...this.props });
  }

  /**
   * 驗證屬性變更
   */
  protected validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {
    return true; // 子類可以重寫此方法
  }

  /**
   * 設置屬性值（返回新的實例）
   */
  protected set<Key extends keyof Props>(key: Key): EntitySetter<Props[Key]> {
    return new EntitySetter(this, key);
  }

  /**
   * 變更屬性值（返回新的實例）
   */
  protected change<Key extends keyof Props>(key: Key, value: Props[Key]): ModernBaseEntity<Props> {
    if (!this.validation(value, key)) {
      throw new Error(`Invalid value for property ${String(key)}`);
    }

    const newProps = { ...this.props, [key]: value };
    return new (this.constructor as any)(newProps);
  }

  /**
   * 更新實體（返回新的實例）
   */
  update(): ModernBaseEntity<Props> {
    const newProps = { ...this.props };
    const newEntity = new (this.constructor as any)(newProps);
    (newEntity as any).updatedAt = new Date();
    (newEntity as any).version = this.version + 1;
    return newEntity;
  }

  /**
   * 生成 ID
   */
  private generateId(): string {
    return `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * 實體屬性設置器類別
 */
export class EntitySetter<T> {
  constructor(
    private readonly entity: ModernBaseEntity<any>,
    private readonly key: keyof any
  ) {}

  to(value: T): ModernBaseEntity<any> {
    return this.entity.change(this.key, value);
  }
}

