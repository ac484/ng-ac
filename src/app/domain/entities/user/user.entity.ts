/**
 * @fileoverview 用戶實體 (User Entity)
 * @description 用戶領域實體
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Domain Layer User Entity
 * - 職責：用戶業務邏輯
 * - 依賴：基礎實體、郵箱值對象
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案定義用戶的業務邏輯
 * - 包含用戶相關的業務規則
 * - 此檔案須遵守此架構規則1：實體設計
 * - 此檔案須遵守此架構規則2：業務邏輯
 * - 此檔案須遵守此架構規則3：數據驗證
 * - 此檔案須遵守此架構規則4：業務規則
 * - 此檔案須遵守此架構規則5：類型安全
 * - 此檔案須遵守此架構規則6：性能優化
 * - 此檔案須遵守此架構規則7：測試友好
 * - 此檔案須遵守此架構規則8：文檔完整
 */

import { BaseEntity } from '../../base';
import { Email } from '../../value-objects/email';

export class User extends BaseEntity {
  email: Email;
  name: string;
  isActive: boolean = true;

  constructor(id: string, email: string, name: string) {
    super(id);
    this.email = new Email(email);
    this.name = name;
  }

  updateProfile(name: string): void {
    this.name = name;
    this.update();
  }

  deactivate(): void {
    this.isActive = false;
    this.update();
  }

  activate(): void {
    this.isActive = true;
    this.update();
  }
}
