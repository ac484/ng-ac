/**
 * @fileoverview 現代 DDD Value Object 基礎類別 (Modern DDD Base Value Object)
 * @description 值物件的基礎抽象類，實現不可變性和業務規則封裝
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Shared Layer Base Value Object
 * - 職責：值物件基礎抽象實現
 * - 依賴：Result 類型
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

import { Result } from '../result/result';

export abstract class BaseValueObject<Props> {
  protected readonly props: Readonly<Props>;

  protected constructor(props: Props) {
    this.props = Object.freeze(props);
  }

  /**
   * 靜態工廠方法，用於創建值物件實例
   * 子類必須實現此方法
   */
  abstract static create(props: any): Result<BaseValueObject<any>>;

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
   * 將值物件轉換為普通物件
   */
  toObject(): Props {
    return { ...this.props };
  }

  /**
   * 比較兩個值物件是否相等
   */
  isEqual(other: BaseValueObject<Props>): boolean {
    if (this === other) return true;
    if (!other || !(other instanceof BaseValueObject)) return false;

    const thisProps = this.toObject();
    const otherProps = other.toObject();

    const thisKeys = Object.keys(thisProps);
    const otherKeys = Object.keys(otherProps);

    if (thisKeys.length !== otherKeys.length) return false;

    return thisKeys.every(key =>
      thisProps[key as keyof Props] === otherProps[key as keyof Props]
    );
  }

  /**
   * 克隆值物件
   */
  clone(): BaseValueObject<Props> {
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
  protected set<Key extends keyof Props>(key: Key): Setter<Props[Key]> {
    return new Setter(this, key);
  }

  /**
   * 變更屬性值（返回新的實例）
   */
  protected change<Key extends keyof Props>(key: Key, value: Props[Key]): BaseValueObject<Props> {
    if (!this.validation(value, key)) {
      throw new Error(`Invalid value for property ${String(key)}`);
    }

    const newProps = { ...this.props, [key]: value };
    return new (this.constructor as any)(newProps);
  }
}

/**
 * 屬性設置器類別
 */
export class Setter<T> {
  constructor(
    private readonly valueObject: BaseValueObject<any>,
    private readonly key: keyof any
  ) {}

  to(value: T): BaseValueObject<any> {
    return this.valueObject.change(this.key, value);
  }
}

