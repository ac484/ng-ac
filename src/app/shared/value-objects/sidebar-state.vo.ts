/**
 * @fileoverview SidebarState 值物件 (Sidebar State Value Object)
 * @description 側邊欄狀態值物件，實現現代 DDD 模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Shared Layer Value Object
 * - 職責：側邊欄狀態值物件實現
 * - 依賴：BaseValueObject, Result
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

import { Result } from '../base/result/result';
import { BaseValueObject } from '../base/value-objects/base-value-object';

export type SidebarStateType = 'open' | 'closed' | 'collapsed';

export interface SidebarStateProps {
  value: SidebarStateType;
}

export class SidebarState extends BaseValueObject<SidebarStateProps> {
  private constructor(props: SidebarStateProps) {
    super(props);
  }

  /**
   * 靜態工廠方法
   */
  static create(value: SidebarStateType): Result<SidebarState> {
    if (!SidebarState.isValidProps({ value })) {
      return Result.fail('Invalid sidebar state value');
    }
    return Result.ok(new SidebarState({ value }));
  }

  /**
   * 驗證屬性
   */
  static isValidProps(props: any): props is SidebarStateProps {
    return props &&
           typeof props.value === 'string' &&
           ['open', 'closed', 'collapsed'].includes(props.value);
  }

  /**
   * 獲取側邊欄狀態值
   */
  get value(): SidebarStateType {
    return this.props.value;
  }

  /**
   * 檢查是否為開啟狀態
   */
  isOpen(): boolean {
    return this.value === 'open';
  }

  /**
   * 檢查是否為關閉狀態
   */
  isClosed(): boolean {
    return this.value === 'closed';
  }

  /**
   * 檢查是否為折疊狀態
   */
  isCollapsed(): boolean {
    return this.value === 'collapsed';
  }

  /**
   * 開啟側邊欄
   */
  open(): SidebarState {
    return SidebarState.create('open').value() || this;
  }

  /**
   * 關閉側邊欄
   */
  close(): SidebarState {
    return SidebarState.create('closed').value() || this;
  }

  /**
   * 折疊側邊欄
   */
  collapse(): SidebarState {
    return SidebarState.create('collapsed').value() || this;
  }

  /**
   * 切換側邊欄狀態
   */
  toggle(): SidebarState {
    const newValue = this.value === 'open' ? 'closed' : 'open';
    return SidebarState.create(newValue).value() || this;
  }
}

