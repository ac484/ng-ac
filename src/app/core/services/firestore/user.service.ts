/**
 * 用戶管理服務
 * 
 * 管理用戶資料的 CRUD 操作
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFirestoreService, BaseEntity, QueryOptions } from './base-firestore.service';

export interface User extends BaseEntity {
  uid: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  
  // 擴展用戶資料
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    language?: string;
    theme?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
  };
  
  // 系統欄位
  isActive: boolean;
  lastLoginAt?: Date;
  roles?: string[];
  permissions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseFirestoreService<User> {
  protected collectionName = 'users';

  /**
   * 根據 Firebase UID 獲取用戶
   */
  getByUid(uid: string): Observable<User | null> {
    return this.getAll({
      where: [{ field: 'uid', operator: '==', value: uid }],
      limit: 1
    }).pipe(
      map(users => users.length > 0 ? users[0] : null)
    );
  }

  /**
   * 根據郵箱獲取用戶
   */
  getByEmail(email: string): Observable<User | null> {
    return this.getAll({
      where: [{ field: 'email', operator: '==', value: email }],
      limit: 1
    }).pipe(
      map(users => users.length > 0 ? users[0] : null)
    );
  }

  /**
   * 創建或更新用戶資料（用於 Firebase Auth 登入後）
   */
  createOrUpdateFromAuth(authUser: any): Observable<string> {
    const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      uid: authUser.uid,
      email: authUser.email || '',
      displayName: authUser.displayName || '',
      photoURL: authUser.photoURL || '',
      phoneNumber: authUser.phoneNumber || '',
      emailVerified: authUser.emailVerified || false,
      isAnonymous: authUser.isAnonymous || false,
      isActive: true,
      lastLoginAt: new Date(),
      roles: ['user'], // 預設角色
      permissions: []
    };

    // 使用 UID 作為文檔 ID
    return this.createWithId(authUser.uid, userData).pipe(
      map(() => authUser.uid)
    );
  }

  /**
   * 更新用戶最後登入時間
   */
  updateLastLogin(uid: string): Observable<void> {
    return this.update(uid, {
      lastLoginAt: new Date()
    } as any);
  }

  /**
   * 更新用戶偏好設定
   */
  updatePreferences(uid: string, preferences: User['preferences']): Observable<void> {
    return this.update(uid, {
      preferences
    } as any);
  }

  /**
   * 更新用戶角色
   */
  updateRoles(uid: string, roles: string[]): Observable<void> {
    return this.update(uid, {
      roles
    } as any);
  }

  /**
   * 更新用戶權限
   */
  updatePermissions(uid: string, permissions: string[]): Observable<void> {
    return this.update(uid, {
      permissions
    } as any);
  }

  /**
   * 啟用/停用用戶
   */
  toggleUserStatus(uid: string, isActive: boolean): Observable<void> {
    return this.update(uid, {
      isActive
    } as any);
  }

  /**
   * 獲取活躍用戶列表
   */
  getActiveUsers(options?: QueryOptions): Observable<User[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'isActive', operator: '==', value: true }
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 根據角色獲取用戶
   */
  getUsersByRole(role: string, options?: QueryOptions): Observable<User[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'roles', operator: 'array-contains', value: role }
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 搜尋用戶（根據顯示名稱或郵箱）
   */
  searchUsers(searchTerm: string, options?: QueryOptions): Observable<User[]> {
    // 注意：Firestore 不支援全文搜尋，這裡使用簡單的前綴匹配
    // 在生產環境中，建議使用 Algolia 或 Elasticsearch 進行全文搜尋
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'displayName', operator: '>=', value: searchTerm },
        { field: 'displayName', operator: '<=', value: searchTerm + '\uf8ff' }
      ]
    };

    return this.getAll(queryOptions);
  }
}