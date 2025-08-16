/**
 * @fileoverview 生產環境配置 (Development Environment Configuration)
 * @description 生產環境的配置變數
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Environment Configuration
 * - 職責：生產環境配置
 * - 依賴：無依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案定義生產環境的配置變數
 * - 包含 API 端點、功能開關等
 * - 此檔案須遵守此架構規則1：環境配置統一化
 * - 此檔案須遵守此架構規則2：配置變數管理
 * - 此檔案須遵守此架構規則3：環境區分
 * - 此檔案須遵守此架構規則4：配置驗證
 * - 此檔案須遵守此架構規則5：安全配置
 * - 此檔案須遵守此架構規則6：性能配置
 * - 此檔案須遵守此架構規則7：調試配置
 * - 此檔案須遵守此架構規則8：日誌配置
 */

export const environment = {
  production: true,
  apiUrl: 'https://api.acc-ng.com',
  debug: false,
  version: '1.0.0',
  // Firebase App Check 配置 - 生产环境不使用 debug token
  firebase: {
    appCheck: {
      debugToken: undefined,
      recaptchaSiteKey: '6LcHy58rAAAAAPe_YYY3st4NwUlTJ1xcj4SWDrH5'
    }
  }
};
