/**
 * @fileoverview Theme 值物件 (Theme Value Object)
 * @description 主題值物件，實現現代 DDD 模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Shared Layer Value Object
 * - 職責：主題值物件實現
 * - 依賴：BaseValueObject, Result
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

import { Result } from '../base/result/result';
import { BaseValueObject } from '../base/value-objects/base-value-object';

export type ThemeType = 'light' | 'dark' | 'auto';

export interface ThemeProps {
  value: ThemeType;
}

export class Theme extends BaseValueObject<ThemeProps> {
  private constructor(props: ThemeProps) {
    super(props);
  }

  /**
   * 靜態工廠方法
   */
  static create(value: ThemeType): Result<Theme> {
    if (!Theme.isValidProps({ value })) {
      return Result.fail('Invalid theme value');
    }
    return Result.ok(new Theme({ value }));
  }

  /**
   * 驗證屬性
   */
  static isValidProps(props: any): props is ThemeProps {
    return props &&
           typeof props.value === 'string' &&
           ['light', 'dark', 'auto'].includes(props.value);
  }

  /**
   * 獲取主題值
   */
  get value(): ThemeType {
    return this.props.value;
  }

  /**
   * 檢查是否為亮色主題
   */
  isLight(): boolean {
    return this.value === 'light';
  }

  /**
   * 檢查是否為暗色主題
   */
  isDark(): boolean {
    return this.value === 'dark';
  }

  /**
   * 檢查是否為自動主題
   */
  isAuto(): boolean {
    return this.value === 'auto';
  }

  /**
   * 切換主題
   */
  toggle(): Theme {
    const newValue = this.value === 'light' ? 'dark' : 'light';
    return Theme.create(newValue).value() || this;
  }

  /**
   * 設置為亮色主題
   */
  setLight(): Theme {
    return Theme.create('light').value() || this;
  }

  /**
   * 設置為暗色主題
   */
  setDark(): Theme {
    return Theme.create('dark').value() || this;
  }

  /**
   * 設置為自動主題
   */
  setAuto(): Theme {
    return Theme.create('auto').value() || this;
  }
}

