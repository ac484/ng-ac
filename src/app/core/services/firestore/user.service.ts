/**
 * 用戶管理服務 - 工業應用簡化版
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
  
  // 工業應用基本資料
  firstName?: string;
  lastName?: string;
  department?: string;      // 部門
  position?: string;        // 職位
  employeeId?: string;      // 員工編號
  
  // 系統欄位
  isActive: boolean;
  lastLoginAt?: Date;
  roles?: string[];         // 角色：admin, manager, user
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
      isActive: true,
      lastLoginAt: new Date(),
      roles: ['user'] // 預設角色
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
   * 更新用戶角色
   */
  updateRoles(uid: string, roles: string[]): Observable<void> {
    return this.update(uid, {
      roles
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
   * 根據部門獲取用戶
   */
  getUsersByDepartment(department: string): Observable<User[]> {
    return this.getAll({
      where: [
        { field: 'department', operator: '==', value: department },
        { field: 'isActive', operator: '==', value: true }
      ],
      orderBy: [{ field: 'displayName', direction: 'asc' }]
    });
  }

  /**
   * 搜尋用戶（根據顯示名稱或員工編號）
   */
  searchUsers(searchTerm: string): Observable<User[]> {
    return this.getAll({
      where: [
        { field: 'displayName', operator: '>=', value: searchTerm },
        { field: 'displayName', operator: '<=', value: searchTerm + '\uf8ff' }
      ],
      orderBy: [{ field: 'displayName', direction: 'asc' }]
    });
  }
}