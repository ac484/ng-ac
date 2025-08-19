/**
 * @fileoverview 數據資源統一導出檔案 (Data Assets Unified Export)
 * @description 存放數據資源的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Assets Data
 * - 職責：數據資源統一導出
 * - 依賴：數據文件
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放數據資源的統一導出，不包含業務邏輯
 * - 所有數據資源必須在此檔案中導出
 * - 數據應按功能分類組織
 * - 支持多種數據格式 (JSON, CSV, XML, YAML)
 */

// ============================================================================
// 數據資源導出 (Data Assets Export)
// ============================================================================

// 配置數據 (待實現)
// export const CONFIG_DATA = {
//   app: '/assets/data/config/app.json',
//   theme: '/assets/data/config/theme.json',
//   i18n: '/assets/data/config/i18n.json',
// };

// 靜態數據 (待實現)
// export const STATIC_DATA = {
//   countries: '/assets/data/static/countries.json',
//   currencies: '/assets/data/static/currencies.json',
//   timezones: '/assets/data/static/timezones.json',
//   languages: '/assets/data/static/languages.json',
// };

// 模擬數據 (待實現)
// export const MOCK_DATA = {
//   users: '/assets/data/mock/users.json',
//   organizations: '/assets/data/mock/organizations.json',
//   products: '/assets/data/mock/products.json',
//   orders: '/assets/data/mock/orders.json',
// };

// 本地化數據 (待實現)
// export const LOCALIZATION_DATA = {
//   'zh-TW': '/assets/data/i18n/zh-TW.json',
//   'zh-CN': '/assets/data/i18n/zh-CN.json',
//   'en-US': '/assets/data/i18n/en-US.json',
//   'ja-JP': '/assets/data/i18n/ja-JP.json',
// };

// 主題數據 (待實現)
// export const THEME_DATA = {
//   light: '/assets/data/themes/light.json',
//   dark: '/assets/data/themes/dark.json',
//   custom: '/assets/data/themes/custom.json',
// };

// 數據加載器 (待實現)
// export const DATA_LOADERS = {
//   loadConfig: async (type: string) => {
//     const response = await fetch(CONFIG_DATA[type]);
//     return response.json();
//   },
//   loadStatic: async (type: string) => {
//     const response = await fetch(STATIC_DATA[type]);
//     return response.json();
//   },
//   loadMock: async (type: string) => {
//     const response = await fetch(MOCK_DATA[type]);
//     return response.json();
//   },
// };

// 臨時導出，解決模組識別問題
export const DATA_PLACEHOLDER = 'data-placeholder';
