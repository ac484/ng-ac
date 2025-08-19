/**
 * @fileoverview 佈局系統常量定義，提供斷點、容器尺寸和間距的統一配置
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2024-12-19 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Shared Layer - Constants
 * • 依賴：無
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 只包含佈局相關的常量定義
 * • 不包含業務邏輯或計算
 *
 * @module LayoutConstants
 * @layer Shared
 * @context Layout System
 * @see docs/5.new_Tree_layout.md
 */

export const LAYOUT_CONSTANTS = {
  BREAKPOINTS: {
    XS: '(max-width: 599.98px)',
    SM: '(min-width: 600px) and (max-width: 959.98px)',
    MD: '(min-width: 960px) and (max-width: 1279.98px)',
    LG: '(min-width: 1280px) and (max-width: 1919.98px)',
    XL: '(min-width: 1920px)'
  },
  CONTAINER: {
    SMALL: 400,
    MEDIUM: 800,
    LARGE: 1200
  },
  SPACING: {
    XS: '0.5rem',
    SM: '1rem',
    MD: '1.5rem',
    LG: '2rem',
    XL: '3rem'
  }
} as const;
