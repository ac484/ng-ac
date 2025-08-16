/**
 * @fileoverview 字體資源統一導出檔案 (Fonts Assets Unified Export)
 * @description 存放字體資源的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Assets Fonts
 * - 職責：字體資源統一導出
 * - 依賴：字體文件
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放字體資源的統一導出，不包含業務邏輯
 * - 所有字體資源必須在此檔案中導出
 * - 字體應按字重和樣式分類組織
 * - 支持多種字體格式 (WOFF2, WOFF, TTF, OTF)
 */

// ============================================================================
// 字體資源導出 (Font Assets Export)
// ============================================================================

// 主要字體 (待實現)
// export const PRIMARY_FONTS = {
//   regular: '/assets/fonts/primary/regular.woff2',
//   medium: '/assets/fonts/primary/medium.woff2',
//   bold: '/assets/fonts/primary/bold.woff2',
//   light: '/assets/fonts/primary/light.woff2',
// };

// 等寬字體 (待實現)
// export const MONOSPACE_FONTS = {
//   regular: '/assets/fonts/monospace/regular.woff2',
//   medium: '/assets/fonts/monospace/medium.woff2',
//   bold: '/assets/fonts/monospace/bold.woff2',
// };

// 圖標字體 (待實現)
// export const ICON_FONTS = {
//   regular: '/assets/fonts/icons/regular.woff2',
//   solid: '/assets/fonts/icons/solid.woff2',
//   brands: '/assets/fonts/icons/brands.woff2',
// };

// 字體配置 (待實現)
// export const FONT_CONFIG = {
//   primary: {
//     family: 'Primary Font',
//     fallback: 'Arial, sans-serif',
//     weights: [300, 400, 500, 600, 700],
//   },
//   monospace: {
//     family: 'Monospace Font',
//     fallback: 'Consolas, monospace',
//     weights: [400, 500, 600],
//   },
// };

// 字體預加載 (待實現)
// export const FONT_PRELOAD = [
//   '/assets/fonts/primary/regular.woff2',
//   '/assets/fonts/primary/medium.woff2',
//   '/assets/fonts/primary/bold.woff2',
// ];

// 臨時導出，解決模組識別問題
export const FONTS_PLACEHOLDER = 'fonts-placeholder';
