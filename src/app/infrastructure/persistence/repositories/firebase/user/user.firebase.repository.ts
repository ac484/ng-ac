/**
 * @fileoverview 用戶 Firebase 倉儲 (User Firebase Repository)
 * @description 提供用戶實體的 Firebase 數據存取實現
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer User Firebase Repository
 * - 職責：用戶實體 Firebase 數據存取
 * - 依賴：FirebaseBaseRepository, User 實體
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供用戶實體的 Firebase 數據存取
 * - 使用極簡主義設計，避免過度複雜化
 * - 嚴格遵守 @angular/fire > firebase > firestore 交互順序
 */

import { Injectable } from '@angular/core';
import { FirebaseBaseRepository } from '../firebase-base.repository';

export interface UserEntity {
  id?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseRepository extends FirebaseBaseRepository<UserEntity> {
  protected collectionName = 'users';

  /**
   * 根據郵箱查找用戶
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.findOneByField('email', '==', email);
  }

  /**
   * 檢查郵箱是否已存在
   */
  async isEmailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * 獲取活躍用戶
   */
  async findActiveUsers(): Promise<UserEntity[]> {
    return await this.findByField('emailVerified', '==', true);
  }

  /**
   * 獲取用戶統計
   */
  async getUserStats(): Promise<{ total: number; verified: number; unverified: number }> {
    const total = await this.count();
    const verified = (await this.findByField('emailVerified', '==', true)).length;
    const unverified = total - verified;

    return { total, verified, unverified };
  }
}
