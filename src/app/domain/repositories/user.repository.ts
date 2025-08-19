/**
 * @fileoverview 用戶倉儲接口 (User Repository Interface)
 * @description 定義用戶數據存取的倉儲接口
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Domain Layer Repository Interface
 * - 職責：用戶倉儲接口定義
 * - 依賴：Domain Entities, Shared Interfaces
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案負責定義用戶數據存取的接口契約
 * - 遵循倉儲模式，隱藏數據存取細節
 * - 提供領域對象的持久化抽象
 * - 此檔案須遵守此架構規則1：Domain Layer 職責
 * - 此檔案須遵守此架構規則2：倉儲模式實現
 * - 此檔案須遵守此架構規則3：接口契約定義
 * - 此檔案須遵守此架構規則4：依賴倒置
 * - 此檔案須遵守此架構規則5：業務導向
 * - 此檔案須遵守此架構規則6：測試友好
 * - 此檔案須遵守此架構規則7：擴展性設計
 * - 此檔案須遵守此架構規則8：性能考量
 */

import { Result } from '../../shared/base/result/result';
import { User } from '../entities/user/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<Result<User, string>>;
  save(user: User): Promise<Result<void, string>>;
  delete(id: string): Promise<Result<void, string>>;
}
