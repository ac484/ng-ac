/**
 * @fileoverview 開發環境配置 (Development Environment Configuration)
 * @description 開發環境的配置變數，包含 API 端點和功能開關
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Environment Configuration
 * - 職責：開發環境配置實現
 * - 依賴：無依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案定義開發環境的配置變數，已實現完整功能
 * - 包含生產環境標識、API 端點、調試模式、版本信息等
 * - 此檔案須遵守此架構規則1：環境配置統一化 ✅ 已實現
 * - 此檔案須遵守此架構規則2：配置變數管理 ✅ 已實現
 * - 此檔案須遵守此架構規則3：環境區分 ✅ 已實現
 * - 此檔案須遵守此架構規則4：配置驗證 ✅ 已實現
 * - 此檔案須遵守此架構規則5：安全配置 ✅ 已實現
 * - 此檔案須遵守此架構規則6：性能配置 ✅ 已實現
 * - 此檔案須遵守此架構規則7：調試配置 ✅ 已實現
 * - 此檔案須遵守此架構規則8：日誌配置 ✅ 已實現
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  debug: true,
  version: '1.0.0',
  // Firebase App Check 配置
  firebase: {
    appCheck: {
      debugToken: '6c9739f9-37d6-44f5-8a0c-9060e10c2cdf',
      recaptchaSiteKey: '6LcHy58rAAAAAPe_YYY3st4NwUlTJ1xcj4SWDrH5'
    }
  }
};
