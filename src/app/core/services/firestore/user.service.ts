/**
 * 用戶管理服務 - 工業應用簡化版
 * 
 * 管理用戶資料的 CRUD 操作
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFirestoreService, BaseEntity, WhereCondition, OrderCondition } from './base-firestore.service';

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
export class UserService {
  private readonly baseService = inject(BaseFirestoreService);
  private readonly collectionName = 'users';

  /**
   * 根據 Firebase UID 獲取用戶
   */
  getByUid(uid: string): Observable<User | null> {
    return this.baseService.findAll<User>(this.collectionName, [
      { field: 'uid', operator: '==', value: uid }
    ], [], 1).pipe(
      map((users: User[]) => users.length > 0 ? users[0] : null)
    );
  }

  /**
   * 根據郵箱獲取用戶
   */
  getByEmail(email: string): Observable<User | null> {
    return this.baseService.findAll<User>(this.collectionName, [
      { field: 'email', operator: '==', value: email }
    ], [], 1).pipe(
      map((users: User[]) => users.length > 0 ? users[0] : null)
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
    return this.baseService.replace<User>(this.collectionName, authUser.uid, userData).pipe(
      map(() => authUser.uid)
    );
  }

  /**
   * 更新用戶最後登入時間
   */
  updateLastLogin(uid: string): Observable<void> {
    return this.baseService.modify<User>(this.collectionName, uid, {
      lastLoginAt: new Date()
    });
  }

  /**
   * 更新用戶角色
   */
  updateRoles(uid: string, roles: string[]): Observable<void> {
    return this.baseService.modify<User>(this.collectionName, uid, {
      roles
    });
  }

  /**
   * 啟用/停用用戶
   */
  toggleUserStatus(uid: string, isActive: boolean): Observable<void> {
    return this.baseService.modify<User>(this.collectionName, uid, {
      isActive
    });
  }

  /**
   * 獲取活躍用戶列表
   */
  getActiveUsers(where: WhereCondition[] = [], order: OrderCondition[] = [], limit?: number): Observable<User[]> {
    const conditions: WhereCondition[] = [
      ...where,
      { field: 'isActive', operator: '==', value: true }
    ];

    return this.baseService.findAll<User>(this.collectionName, conditions, order, limit);
  }

  /**
   * 根據角色獲取用戶
   */
  getUsersByRole(role: string, where: WhereCondition[] = [], order: OrderCondition[] = [], limit?: number): Observable<User[]> {
    const conditions: WhereCondition[] = [
      ...where,
      { field: 'roles', operator: 'array-contains', value: role }
    ];

    return this.baseService.findAll<User>(this.collectionName, conditions, order, limit);
  }

  /**
   * 根據部門獲取用戶
   */
  getUsersByDepartment(department: string): Observable<User[]> {
    return this.baseService.findAll<User>(this.collectionName, [
      { field: 'department', operator: '==', value: department },
      { field: 'isActive', operator: '==', value: true }
    ], [
      { field: 'displayName', direction: 'asc' }
    ]);
  }

  /**
   * 搜尋用戶（根據顯示名稱或員工編號）
   */
  searchUsers(searchTerm: string): Observable<User[]> {
    return this.baseService.findAll<User>(this.collectionName, [
      { field: 'displayName', operator: '>=', value: searchTerm },
      { field: 'displayName', operator: '<=', value: searchTerm + '\uf8ff' }
    ], [
      { field: 'displayName', direction: 'asc' }
    ]);
  }

  /**
   * 獲取所有用戶
   */
  findAll(where: WhereCondition[] = [], order: OrderCondition[] = [], limit?: number): Observable<User[]> {
    return this.baseService.findAll<User>(this.collectionName, where, order, limit);
  }

  /**
   * 根據 ID 獲取用戶
   */
  findById(id: string): Observable<User | null> {
    return this.baseService.findById<User>(this.collectionName, id);
  }

  /**
   * 創建用戶
   */
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    return this.baseService.create<User>(this.collectionName, data);
  }

  /**
   * 替換用戶資料
   */
  replace(id: string, data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<void> {
    return this.baseService.replace<User>(this.collectionName, id, data);
  }

  /**
   * 修改用戶資料
   */
  modify(id: string, data: Partial<User>): Observable<void> {
    return this.baseService.modify<User>(this.collectionName, id, data);
  }

  /**
   * 刪除用戶
   */
  remove(id: string): Observable<void> {
    return this.baseService.remove(this.collectionName, id);
  }
}