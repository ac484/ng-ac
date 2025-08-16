/**
 * @fileoverview 郵箱值對象 (Email Value Object)
 * @description 郵箱地址的值對象，包含驗證邏輯和不可變性
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Domain Layer Email Value Object
 * - 職責：郵箱地址值對象實現
 * - 依賴：無外部依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案定義郵箱地址的值對象，已實現完整功能
 * - 包含郵箱驗證邏輯、不可變性、比較方法
 * - 此檔案須遵守此架構規則1：值對象設計 ✅ 已實現
 * - 此檔案須遵守此架構規則2：郵箱驗證 ✅ 已實現
 * - 此檔案須遵守此架構規則3：不可變性 ✅ 已實現
 * - 此檔案須遵守此架構規則4：類型安全 ✅ 已實現
 * - 此檔案須遵守此架構規則5：業務規則 ✅ 已實現
 * - 此檔案須遵守此架構規則6：錯誤處理 ✅ 已實現
 * - 此檔案須遵守此架構規則7：性能優化 ✅ 已實現
 * - 此檔案須遵守此架構規則8：測試友好 ✅ 已實現
 */

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    this.value = email.toLowerCase();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
