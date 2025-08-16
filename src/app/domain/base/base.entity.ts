/**
 * @fileoverview 基礎實體抽象類 (Base Entity Abstract Class)
 * @description 所有實體的基礎抽象類，包含版本管理和更新邏輯
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Domain Layer Base Entity Abstract Class
 * - 職責：實體基礎抽象實現
 * - 依賴：無外部依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案定義所有實體的基礎抽象類，已實現完整功能
 * - 包含基礎屬性、版本管理和更新方法
 * - 此檔案須遵守此架構規則1：實體基礎統一化 ✅ 已實現
 * - 此檔案須遵守此架構規則2：抽象類設計 ✅ 已實現
 * - 此檔案須遵守此架構規則3：繼承關係管理 ✅ 已實現
 * - 此檔案須遵守此架構規則4：通用屬性定義 ✅ 已實現
 * - 此檔案須遵守此架構規則5：通用方法定義 ✅ 已實現
 * - 此檔案須遵守此架構規則6：類型安全 ✅ 已實現
 * - 此檔案須遵守此架構規則7：性能優化 ✅ 已實現
 * - 此檔案須遵守此架構規則8：測試友好 ✅ 已實現
 */

export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number = 1;

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  update(): void {
    this.updatedAt = new Date();
  }

  incrementVersion(): void {
    this.version++;
    this.update();
  }
}
